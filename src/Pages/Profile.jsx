import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Heart, Star, Play, Share2, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { favoritesService } from '../api/favoritesService';
import { ratingsService } from '../api/ratingsService';
import { userService } from '../api/userService';
import MediaCard from '../componet/MediaCard';
import Navbar from '../componet/Navbar';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userData';

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [user, setUserState] = useState(JSON.parse(localStorage.getItem('user')) || {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
    });
    // دالة ترجع رابط صورة البروفايل بشكل صحيح
    const getProfileImageUrl = () => {
        if (!user || !user.profileImage) {
            return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
        }

        let url = "";

        // لو profileImage object
        if (typeof user.profileImage === "object" && user.profileImage.url) {
            url = user.profileImage.url;
        } else if (typeof user.profileImage === "string") {
            url = user.profileImage;
        }

        if (!url) {
            return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
        }

        // لو الرابط يبدأ بـ http نستخدمه كما هو
        if (url.startsWith("http")) {
            return url;
        }

        // لو رابط نسبي من السيرفر
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const [favorites, setFavorites] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        loadUserData();

        // Check URL parameters for success message
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('added') === 'true') {
            setShowSuccessMessage(true);
            // Clear the URL parameter
            navigate('/profile', { replace: true });

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }
    }, [location.search]);

    // Listen for navigation events to refresh data
    useEffect(() => {
        // When the window regains focus we should NOT automatically re-fetch
        // large data from the API. Only update the local `user` state from
        // localStorage so UI reflects any user changes (login/logout).
        const handleFocus = () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) setUserState(storedUser);
            } catch (e) {
                // ignore invalid JSON
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load favorites
            const favoritesResponse = await favoritesService.getes();

            if (favoritesResponse && favoritesResponse.favorites) {
                setFavorites(favoritesResponse.favorites);
            } else {
                setFavorites([]);
            }

            // Load user ratings from API
            try {
                const ratingsResponse = await ratingsService.getUserRatings();

                // The response should contain an array of ratings with work details
                // Each rating object should have: { work: {...}, ratingValue: 5, ... }
                if (ratingsResponse && Array.isArray(ratingsResponse)) {
                    // Extract the work details from each rating
                    const worksFromRatings = ratingsResponse
                        .filter(rating => rating.work) // Only include ratings that have work details
                        .map(rating => ({
                            ...rating.work,
                            userRating: rating.ratingValue // Add the user's rating to the work object
                        }));
                    setRatings(worksFromRatings);
                } else if (ratingsResponse && ratingsResponse.ratings) {
                    const worksFromRatings = ratingsResponse.ratings
                        .filter(rating => rating.work)
                        .map(rating => ({
                            ...rating.work,
                            userRating: rating.ratingValue
                        }));
                    setRatings(worksFromRatings);
                } else {
                    setRatings([]);
                }
            } catch (ratingsError) {
                console.error('Error loading ratings:', ratingsError);
                setRatings([]);
            }
        } catch (err) {
            console.error('Error loading user data:', err);
            setError('حدث خطأ في تحميل البيانات');
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteChange = (workId, newStatus, response) => {
        console.log('Favorite status changed:', { workId, newStatus, response });

        // Update local state when favorite status changes
        if (newStatus) {
            // Work was added to favorites - we need to add it to the list
            // This would typically be handled by refetching the favorites list
            console.log('Work added to favorites, reloading data...');
            loadUserData();
        } else {
            // Work was removed from favorites - remove it from the list
            console.log('Work removed from favorites, updating local state...');
            setFavorites(prev => prev.filter(work => work._id !== workId));
        }
    };

    const handleRemoveFromFavorites = async (workId) => {
        try {
            await favoritesService.removeFromFavorites(workId);
            setFavorites(prev => prev.filter(work => work._id !== workId));
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    const handleImageClick = () => {
        console.log('🖱️ Image clicked!');
        if (fileInputRef.current) {
            console.log('📎 Opening file picker...');
            fileInputRef.current.click();
        } else {
            console.error('❌ fileInputRef is null!');
        }
    };

    const handleImageChange = async (event) => {
        console.log('📸 handleImageChange called!');
        console.log('Event:', event);
        console.log('Files:', event.target.files);

        const file = event.target.files[0];
        if (!file) {
            console.log('❌ No file selected');
            return;
        }

        console.log('✅ Selected file:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('الرجاء اختيار صورة فقط');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('حجم الصورة كبير جداً. الرجاء اختيار صورة أقل من 5 ميجابايت');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file);

        console.log('📦 FormData created, uploading...');

        try {
            setUploadingImage(true);
            console.log('🚀 Calling API...');

            const response = await userService.updateProfileImage(formData);

            console.log('✅ API Response received:', response);
            console.log('Response structure:', JSON.stringify(response, null, 2));

            // Handle different response formats
            let profileImageUrl;
            let updatedUserData;

            // Check all possible response structures
            if (response.user && response.user.profileImage) {
                console.log('Found profileImage in response.user');
                profileImageUrl = response.user.profileImage;
                updatedUserData = response.user;
            } else if (response.profileImage) {
                console.log('Found profileImage in response');
                profileImageUrl = response.profileImage;
            } else if (response.data && response.data.user && response.data.user.profileImage) {
                console.log('Found profileImage in response.data.user');
                profileImageUrl = response.data.user.profileImage;
                updatedUserData = response.data.user;
            } else if (response.data && response.data.profileImage) {
                console.log('Found profileImage in response.data');
                profileImageUrl = response.data.profileImage;
            }

            console.log('Extracted Profile Image URL:', profileImageUrl);

            if (profileImageUrl) {
                // Update user state with new image
                const updatedUser = updatedUserData || { ...user, profileImage: profileImageUrl };

                console.log('Updating user state:', updatedUser);
                setUserState(updatedUser);

                // Update local storage
                localStorage.setItem('user', JSON.stringify(updatedUser));
                console.log('Updated localStorage');

                // Update Redux store
                dispatch(setUser(updatedUser));
                console.log('Updated Redux store');

                // alert('✅ تم تحديث الصورة الشخصية بنجاح!');
                console.log('✅ Profile image updated successfully:', profileImageUrl);
            } else {
                console.error('❌ Could not find profileImage in response');
                console.error('Full response:', response);
                alert('تم رفع الصورة ولكن لم يتم العثور على رابط الصورة في الاستجابة. تحقق من Console للمزيد من التفاصيل.');
            }
        } catch (error) {
            console.error('❌ Error updating profile image:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });

            let errorMessage = 'حدث خطأ أثناء تحديث الصورة الشخصية';

            if (error.response?.status === 401) {
                errorMessage = 'يجب تسجيل الدخول أولاً';
            } else if (error.response?.status === 413) {
                errorMessage = 'حجم الصورة كبير جداً';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            alert(errorMessage + '\n\nتحقق من Console للمزيد من التفاصيل.');
        } finally {
            setUploadingImage(false);
            console.log('Upload process completed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: 'black' }}>
                <div className="text-center">
                    <p className="text-red-400 text-lg mb-4">{error}</p>
                    <button
                        onClick={loadUserData}
                        className="px-6 py-3 bg-amber-300 text-black rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Navbar />
            {/* User Header Section */}
            <div className="flex flex-col items-center py-6" style={{ backgroundColor: 'var(--color-secondary)' }}>
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                    <img
                        src={getProfileImageUrl()}
                        alt="User Avatar"
                        className="rounded-full w-32 h-32 mb-4 border-4 object-cover"
                        style={{ borderColor: 'var(--color-accent)' }}
                    />



                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                    {uploadingImage && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center mb-4">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
                <h2 className="text-xl font-bold">{user.username || user.name}</h2>
                <p className="text-sm text-gray-300">{user.email}</p>
                {(user.role === 'admin' || user.role === 'publisher') && (
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-black hover:opacity-90 shadow transition-all duration-300"
                        style={{ backgroundColor: "var(--color-accent)" }}
                    >
                        <PlusCircle className="w-5 h-5" />
                        لوحة التحكم
                    </button>
                )}
            </div>

            <div className="p-6 space-y-8">
                {/* Success Message */}
                {showSuccessMessage && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-300 font-medium">
                                تم إضافة العمل إلى المفضلة بنجاح! 🎉
                            </p>
                        </div>
                    </div>
                )}

                {/* Ratings Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-accent)' }}>
                        🎬 تم تقييمه ({ratings.length})
                    </h3>
                    {ratings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {ratings.map((work) => (
                                <MediaCard
                                    key={work._id}
                                    work={work}
                                    showFavoriteButton={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">لم تقم بتقييم أي عمل فني بعد</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 px-6 py-3 bg-amber-300 text-black rounded-lg hover:bg-amber-400 transition-colors"
                            >
                                تصفح الأعمال الفنية
                            </button>
                        </div>
                    )}
                </div>

                {/* Favorites Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>
                            📺 المفضلة ({favorites.length})
                        </h3>
                        <button
                            onClick={loadUserData}
                            className="px-4 py-2 bg-amber-300 text-black rounded-lg hover:bg-amber-400 transition-colors text-sm"
                        >
                            تحديث
                        </button>
                    </div>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {favorites.map((work) => (
                                <div key={work._id} className="relative group">
                                    <MediaCard
                                        work={work}
                                        onFavoriteChange={handleFavoriteChange}
                                    />
                                    <button
                                        onClick={() => handleRemoveFromFavorites(work._id)}
                                        className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                        title="إزالة من المفضلة"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">قائمة المفضلة فارغة</p>
                            <p className="text-gray-500 text-sm mb-4">اضغط على أيقونة القلب لإضافة أعمالك المفضلة</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-amber-300 text-black rounded-lg hover:bg-amber-400 transition-colors"
                            >
                                تصفح الأعمال الفنية
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;