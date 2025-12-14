import Navbar from '../componet/Navbar';
import Footer from '../componet/Footer';
import React, { useEffect, useState, useMemo } from 'react';
import { Star, Play, User, Heart, Share2, Link as LinkIcon, Trash2 } from 'lucide-react';
import { fetchAverageRatings, fetchItemById, fetchMovies } from '../redux/moviesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../api/axiosInstance';
import { commentService } from '../api/commentService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FavoriteButton from '../componet/FavoriteButton';
import AddToFavoritesButton from '../componet/AddToFavoritesButton';
import { favoritesService } from '../api/favoritesService';
import MediaCard from '../componet/MediaCard';

import { toast } from 'react-toastify';

const Details = () => {
    const { id } = useParams();
    const { selectedItem, loading, error, allMoviesLoading } = useSelector((state) => state.movies);
    const { allMovies, ratings, ratingsLoading } = useSelector(state => state.movies);
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fallback to localStorage if Redux state is not available
    const user = currentUser || JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        if (id) {
            dispatch(fetchItemById(id));
        }
    }, [dispatch, id]);


    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const similarMovies = useMemo(() => {
        if (!selectedItem || !allMovies) return [];
        return allMovies.filter(
            (movie) =>
                movie.genre == selectedItem?.genre &&
                movie.type == selectedItem?.type &&
                movie._id !== selectedItem?._id
        ).slice(0, 15);
    }, [allMovies, selectedItem]);

    useEffect(() => {
        if (similarMovies.length > 0) {
            const workIds = similarMovies.map(movie => movie._id);
            dispatch(fetchAverageRatings(workIds));
        }
    }, [similarMovies, dispatch]);
    const getMovieRating = (movieId) => {
        const rating = ratings[movieId];
        if (rating && rating.average > 0) {
            return {
                average: rating.average,
                count: rating.count,
                displayText: `${rating.average.toFixed(1)} (${rating.count})`
            };
        }
        return {
            average: 0,
            count: 0,
            displayText: 'لا توجد تقييمات'
        };
    };

    const [avgRating, setAvgRating] = useState({ average: 0, count: 0 });
    const [comments, setComments] = useState([]);
    const [myRating, setMyRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [ratingLoading, setRatingLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [userRatingLoading, setUserRatingLoading] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);


    // Check if work is in favorites
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!id) return;
            try {
                const status = await favoritesService.checkeStatus(id);
                setIsFavorite(status.isFavorite);
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };
        checkFavoriteStatus();
    }, [id]);

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('يجب تسجيل الدخول أولاً');
            navigate('/login');
            return;
        }

        setFavoriteLoading(true);
        try {
            await favoritesService.toggleFavorite(id, isFavorite);
            setIsFavorite(!isFavorite);
            toast.success(isFavorite ? 'تم إزالة العمل من المفضلة' : 'تم إضافة العمل إلى المفضلة');
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
        } finally {
            setFavoriteLoading(false);
        }
    };

    useEffect(() => {
        if (!id || !selectedItem) return;


        // Fetch average rating
        setRatingLoading(true);
        axiosInstance.get(`/ratings/average/${id}`)
            .then((r) => setAvgRating(r.data))
            .catch((error) => {
                console.error('Error fetching average rating:', error);
                setAvgRating({ average: 0, count: 0 });
            })
            .finally(() => setRatingLoading(false));

        // Fetch comments
        setCommentLoading(true);
        axiosInstance.get(`/comments/work/${id}`)
            .then((r) => setComments(r.data))
            .catch((error) => {
                console.error('Error fetching comments:', error);
                setComments([]);
            })
            .finally(() => setCommentLoading(false));

        // Fetch user's rating if logged in
        const token = localStorage.getItem('token');
        if (token) {
            setUserRatingLoading(true);
            axiosInstance.get(`/ratings/user/${id}`)
                .then((r) => {
                    setMyRating(r.data.ratingValue);
                    setHasRated(r.data.ratingValue > 0);
                })
                .catch((error) => {
                    console.error('Error fetching user rating:', error);
                    setMyRating(0);
                    setHasRated(false);
                })
                .finally(() => setUserRatingLoading(false));
        }
    }, [id, selectedItem]);

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-black" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white text-lg">جاري تحميل تفاصيل العمل...</p>
                    </div>
                </div>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <div className='bg-black'>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <div className="text-center">
                        <div className="text-red-400 text-lg mb-4">حدث خطأ في تحميل البيانات</div>
                        <p className="text-gray-300 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-amber-300 text-black rounded-lg hover:bg-amber-400 transition-colors"
                        >
                            العودة للصفحة الرئيسية
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No item found
    if (!selectedItem) {
        return (
            <div className='bg-black'>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <div className="text-center">
                        <div className="text-gray-400 text-lg mb-4">لم يتم العثور على العمل المطلوب</div>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-amber-300 text-black rounded-lg hover:bg-amber-400 transition-colors"
                        >
                            العودة للصفحة الرئيسية
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleShareClick = (e) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/Details/${id}`;

        if (navigator.share) {
            navigator.share({
                title: selectedItem.nameArabic,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('تم نسخ الرابط!');
        }
    };

    const submitRating = (val) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('يجب تسجيل الدخول لتقييم هذا العمل');
            navigate('/login');
            return;
        }

        if (hasRated) {
            alert('لقد قمت بتقييم هذا العمل مسبقاً بتقييم ' + myRating + '/5 نجوم.\nلا يمكنك التقييم مرة أخرى أو تغيير تقييمك.');
            return;
        }

        setRatingLoading(true);
        console.log('Submitting rating:', { workId: id, ratingValue: val });

        axiosInstance.post('/ratings', { workId: id, ratingValue: val })
            .then((response) => {
                console.log('Rating submitted successfully:', response.data);
                setMyRating(val);
                setHasRated(true);
                // Refresh average rating
                return axiosInstance.get(`/ratings/average/${id}`);
            })
            .then((r) => {
                setAvgRating(r.data);
                alert(`تم تقييم العمل بنجاح! تقييمك: ${val}/5 نجوم`);
            })
            .catch((error) => {
                console.error('Error submitting rating:', error);
                alert('حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.');
            })
            .finally(() => setRatingLoading(false));
    };

    const submitComment = () => {
        if (!newComment.trim()) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('يجب تسجيل الدخول لإضافة تعليق');
            navigate('/login');
            return;
        }

        setCommentLoading(true);
        axiosInstance.post('/comments', { workId: id, commentText: newComment })
            .then((r) => {
                // إضافة معلومات المستخدم الحالي للتعليق الجديد
                const newCommentWithUser = {
                    ...r.data,
                    user: {
                        username: user?.username || 'مستخدم'
                    },
                    createdAt: new Date().toISOString()
                };
                setComments([newCommentWithUser, ...comments]);
                setNewComment('');
                toast.success('تم إضافة التعليق بنجاح!');
            })
            .catch((error) => {
                console.error('Error submitting comment:', error);
                toast.error('حدث خطأ أثناء إرسال التعليق. يرجى المحاولة مرة أخرى.');
            })
            .finally(() => setCommentLoading(false));
    };

    const deleteComment = async (commentId) => {
        if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
            return;
        }

        try {
            await commentService.deleteComment(commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
            toast.success('تم حذف التعليق بنجاح');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('حدث خطأ أثناء حذف التعليق');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            const isFilled = i < fullStars;
            const isHalf = i === fullStars && hasHalfStar;

            stars.push(
                <Star
                    key={i}
                    size={14}
                    className={`lucide lucide-star fill-current text-primary transition-colors duration-200 ${isFilled ? '' : isHalf ? 'opacity-75' : 'opacity-50'
                        }`}
                />
            );
        }

        return stars;
    };

    return (
       <div className="bg-black pt-[180px] md:pt-0">

            <Navbar />
            <div className="min-h-screen bg-[#121212] text-white font-sans bg-black">
                {/* Hero Section */}
                <div className="relative w-full h-[85vh] lg:h-[90vh]">
                    {/* Background Image with Parallax-like effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            alt={selectedItem.nameArabic}
                            className="w-full h-full object-cover blur-sm scale-105 opacity-60"
                            src={selectedItem.posterUrl || selectedItem.posterImage?.url || 'https://via.placeholder.com/800x600?text=No+Image'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent" />
                    </div>

                    <div className="relative container mx-auto px-4 h-full flex items-end pb-12 lg:pb-20">
                        <div className=" flex flex-col lg:flex-row gap-8 lg:gap-16 items-end w-full">
                            {/* Poster Card */}
                            <div className=" hidden lg:block flex-shrink-0 w-[300px] xl:w-[350px] relative group perspective-1000">
                                <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 transform group-hover:scale-105 group-hover:rotate-y-6">
                                    <img
                                        alt={selectedItem.nameArabic}
                                        className="w-full h-auto object-cover"
                                        src={selectedItem.posterUrl || selectedItem.posterImage?.url || 'https://via.placeholder.com/400x600?text=No+Image'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>

                            {/* Content Info */}
                            <div className="flex-1 space-y-6 lg:mb-8">
                                {/* Mobile Poster (Visible only on small screens) */}
                                    <img
                                                alt={selectedItem.nameArabic}
                                                src={
                                                    selectedItem.posterUrl ||
                                                    selectedItem.posterImage?.url ||
                                                    'https://via.placeholder.com/200x300?text=No+Image'
                                                }
                                                className="
                                                    block md:hidden
                                                    object-cover 
                                                    w-32 h-48        /* mobile */
                                                    sm:w-40 sm:h-60  /* small */
                                                    md:w-48 md:h-72  /* tablets (لو شلت md:hidden) */
                                                    mx-auto          /* توسيط */
                                                "
                                    />



                                {/* Title & Badges */}
                                <div className="space-y-2 text-center lg:text-right">
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
                                        <span className="px-3 py-1 bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-full text-xs font-bold backdrop-blur-md">
                                            {selectedItem.type === 'movie' ? 'فيلم' : 'مسلسل'}
                                        </span>
                                        {selectedItem.year && (
                                            <span className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-bold backdrop-blur-md">
                                                {selectedItem.year}
                                            </span>
                                        )}
                                        <span className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1">
                                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                            {avgRating.average.toFixed(1)}
                                        </span>
                                    </div>

                                    <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-lg leading-tight">
                                        {selectedItem.nameArabic}
                                    </h1>
                                    <h2 className="text-xl lg:text-3xl text-gray-400 font-light tracking-wide">
                                        {selectedItem.nameEnglish}
                                    </h2>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                                    <button className="flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-black rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                        <Play size={24} className="fill-current" />
                                        <span>مشاهدة الآن</span>
                                    </button>

                                    <button
                                        onClick={handleFavoriteClick}
                                        disabled={favoriteLoading}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all border backdrop-blur-md ${isFavorite
                                            ? 'bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30'
                                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                            } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Heart size={24} className={isFavorite ? "fill-current" : ""} />
                                        <span>{favoriteLoading ? 'جاري التحميل...' : (isFavorite ? 'في المفضلة' : 'إضافة للمفضلة')}</span>
                                    </button>

                                    <button
                                        onClick={handleShareClick}
                                        className="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-md"
                                    >
                                        <Share2 size={24} />
                                        <span>مشاركة</span>
                                    </button>
                                </div>

                                {/* Story / Synopsis */}
                                <div className="max-w-3xl pt-6 text-center lg:text-right mx-auto lg:mx-0">
                                    <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center justify-center lg:justify-start gap-2">
                                        <span className="w-8 h-1 bg-amber-400 rounded-full inline-block"></span>
                                        القصة
                                    </h3>
                                    <p className="text-gray-300 text-lg leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
                                        {selectedItem.description || selectedItem.summary || 'لا يوجد وصف متاح لهذا العمل حالياً.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid & Info */}
                <div className="container mx-auto px-4 py-12 -mt-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Right Column: Stats & Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">معلومات العمل</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <Star className="w-5 h-5 text-amber-400" />
                                            التقييم
                                        </span>
                                        <span className="font-bold text-white flex items-center gap-1">
                                            {avgRating.average.toFixed(1)}
                                            <span className="text-xs text-gray-500">({avgRating.count})</span>
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-400" />
                                            التصنيف
                                        </span>
                                        <span className="font-bold text-white">{selectedItem.genre || 'غير محدد'}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            <Play className="w-5 h-5 text-green-400" />
                                            النوع
                                        </span>
                                        <span className="font-bold text-white">{selectedItem.type === 'movie' ? 'فيلم' : 'مسلسل'}</span>
                                    </div>

                                    {selectedItem.duration && (
                                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <span className="text-gray-400 flex items-center gap-2">
                                                ⏱️ المدة
                                            </span>
                                            <span className="font-bold text-white">{selectedItem.duration}</span>
                                        </div>
                                    )}

                                    {selectedItem.type === 'series' && (
                                        <>
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <span className="text-gray-400 flex items-center gap-2">📺 المواسم</span>
                                                <span className="font-bold text-white">{selectedItem.seasonsCount || 'غير محدد'}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <span className="text-gray-400 flex items-center gap-2">🎬 الحلقات</span>
                                                <span className="font-bold text-white">{selectedItem.episodesCount || 'غير محدد'}</span>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                        <span className="text-gray-400 flex items-center gap-2">
                                            📅 السنة
                                        </span>
                                        <span className="font-bold text-white">{selectedItem.year || 'غير محدد'}</span>
                                    </div>
                                </div>

                                {/* User Rating Interaction */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <h4 className="text-sm font-bold text-gray-400 mb-4 text-center">قيّم هذا العمل</h4>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => submitRating(star)}
                                                disabled={ratingLoading || userRatingLoading || hasRated}
                                                className={`transition-all transform hover:scale-125 ${hasRated && myRating >= star
                                                    ? 'text-amber-400'
                                                    : 'text-gray-600 hover:text-amber-400'
                                                    }`}
                                            >
                                                <Star
                                                    size={28}
                                                    className={hasRated && myRating >= star ? "fill-current" : ""}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {hasRated && (
                                        <p className="text-center text-green-400 text-xs mt-2 font-medium">
                                            شكراً لتقييمك! ({myRating}/5)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Left Column: Comments & Extra Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Movie Details Extended */}
                            <div className="bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">تفاصيل إضافية</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <h4 className="text-gray-400 text-sm mb-1">المخرج</h4>
                                        <p className="text-white font-medium text-lg">{selectedItem.director || 'غير محدد'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <h4 className="text-gray-400 text-sm mb-1">مساعد المخرج</h4>
                                        <p className="text-white font-medium text-lg">{selectedItem.assistantDirector || 'غير محدد'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <h4 className="text-gray-400 text-sm mb-1">مكان التصوير</h4>
                                        <p className="text-white font-medium text-lg">{selectedItem.filmingLocation || 'غير محدد'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <h4 className="text-gray-400 text-sm mb-1">تاريخ الإصدار</h4>
                                        <p className="text-white font-medium text-lg">
                                            {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-gray-400 text-sm mb-3">طاقم العمل</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedItem.cast && selectedItem.cast.length > 0 ? (
                                            selectedItem.cast.map((actor, index) => (
                                                <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 transition-colors cursor-default">
                                                    {actor}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">لم يتم تحديد الممثلين</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2c2c2c] border border-gray-700 rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-white tracking-tight">
                                        ⭐ التقييمات والآراء
                                    </h2>
                                </div>

                                <div className="text-center py-10 bg-[#1f1f1f] rounded-xl shadow-md">
                                    <div className="px-4">
                                        <div className="text-gray-300 text-lg font-medium mb-4">
                                            {ratingLoading ? (
                                                <div className="animate-pulse bg-gray-600 h-6 w-48 rounded mx-auto"></div>
                                            ) : (
                                                `متوسط التقييم: ${avgRating.average.toFixed(1)} (${avgRating.count} تقييم)`
                                            )}
                                        </div>

                                        {/* User Rating Status */}
                                        {userRatingLoading ? (
                                            <div className="text-center mb-4">
                                                <div className="animate-pulse bg-gray-600 h-4 w-32 rounded mx-auto mb-2"></div>
                                            </div>
                                        ) : hasRated ? (
                                            <div className="text-center mb-4">
                                                <div className="text-yellow-400 font-semibold mb-2">
                                                    تقييمك: {myRating}/5 ⭐
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    لا يمكنك تغيير تقييمك بعد التقييم
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center mb-4">
                                                <div className="text-white font-semibold mb-2">
                                                    قيّم هذا العمل
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    اختر من 1 إلى 5 نجوم
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-center gap-2 mb-6">
                                            {[1, 2, 3, 4, 5].map(v => (
                                                <button
                                                    key={v}
                                                    onClick={() => submitRating(v)}
                                                    disabled={ratingLoading || userRatingLoading || hasRated}
                                                    title={hasRated ? `لقد قيّمت هذا العمل مسبقاً` : `قيّم العمل بـ ${v}/5 نجوم`}
                                                    className={`p-2 rounded transition-all duration-200 ${myRating >= v
                                                        ? 'bg-yellow-500 text-black'
                                                        : 'bg-white/10 text-white'
                                                        } ${(ratingLoading || userRatingLoading || hasRated)
                                                            ? 'opacity-50 cursor-not-allowed'
                                                            : 'hover:bg-white/20'
                                                        }`}
                                                >
                                                    <Star
                                                        size={20}
                                                        className={myRating >= v ? "fill-current text-black" : "text-white"}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                value={newComment}
                                                onChange={e => setNewComment(e.target.value)}
                                                placeholder="أضف تعليقك"
                                                className="flex-1 p-2 rounded bg-[#2a2a2a] text-white"
                                                disabled={commentLoading}
                                            />
                                            <button
                                                onClick={submitComment}
                                                disabled={commentLoading || !newComment.trim()}
                                                className={`px-4 py-2 rounded transition-all duration-200 ${commentLoading || !newComment.trim()
                                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                                    : 'bg-yellow-500 text-black hover:bg-yellow-600'
                                                    }`}
                                            >
                                                {commentLoading ? 'جاري الإرسال...' : 'إرسال'}
                                            </button>
                                        </div>

                                        <div className="text-right mt-6 space-y-3">
                                            {commentLoading ? (
                                                <div className="animate-pulse space-y-3">
                                                    {Array(3).fill("⭐").map((star, i) => (
                                                        <div key={i} className="p-3 bg-[#2a2a2a] rounded flex items-center gap-2">
                                                            <span className="text-yellow-400 text-lg">{star}</span>
                                                            <div className="animate-pulse bg-gray-600 h-4 w-full rounded"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : comments.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-400">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                                                </div>
                                            ) : (
                                                comments.map(c => {
                                                    // الحصول على اسم المستخدم من بيانات التعليق فقط (لا نستخدم اسم المستخدم الحالي كـ fallback)
                                                    const commentUsername = c.user?.username || c.userId?.username || 'مستخدم';
                                                    const isCurrentUser = commentUsername === user?.username;

                                                    return (
                                                        <div key={c._id} className="p-4 bg-[#2a2a2a] rounded-lg text-white text-right relative border border-gray-700 hover:border-amber-400/50 transition-all duration-200">
                                                            <div className="flex justify-between items-start gap-3">
                                                                <div className="flex-1">
                                                                    {/* اسم المستخدم */}
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm ${isCurrentUser
                                                                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                                                                            : 'bg-gradient-to-br from-amber-400 to-amber-600'
                                                                            }`}>
                                                                            {commentUsername.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className={`font-bold text-sm ${isCurrentUser ? 'text-green-400' : 'text-amber-400'
                                                                                }`}>
                                                                                {commentUsername}
                                                                                {isCurrentUser && <span className="text-xs mr-1">(أنت)</span>}
                                                                            </p>
                                                                            {c.createdAt && (
                                                                                <p className="text-xs text-gray-500">
                                                                                    {new Date(c.createdAt).toLocaleDateString('ar-EG', {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {/* نص التعليق */}
                                                                    <p className="text-gray-200 leading-relaxed pr-10">
                                                                        {c.commentText}
                                                                    </p>
                                                                </div>
                                                                {user?.role === 'admin' && (
                                                                    <button
                                                                        onClick={() => deleteComment(c._id)}
                                                                        className="p-2 text-red-500 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
                                                                        title="حذف التعليق"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}

                                        </div>
                                        <div className="text-right mt-6 space-y-3">
                                            {commentLoading ? (
                                                <div className="animate-pulse space-y-3">
                                                    {Array(3).fill("⭐").map((star, i) => (
                                                        <div key={i} className="p-3 bg-[#2a2a2a] rounded flex items-center gap-2">
                                                            <span className="text-yellow-400 text-lg">{star}</span>
                                                            <div className="animate-pulse bg-gray-600 h-4 w-full rounded"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : comments.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-400">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                                                </div>
                                            ) : (
                                                comments.map(c => {
                                                    const commentUsername = c.user?.username || c.userId?.username || 'مستخدم';
                                                    const isCurrentUser = commentUsername === user?.username;

                                                    return (
                                                        <div key={c._id} className="p-4 bg-[#2a2a2a] rounded-lg text-white text-right relative border border-gray-700 hover:border-amber-400/50 transition-all duration-200">
                                                            <div className="flex justify-between items-start gap-3">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm ${isCurrentUser
                                                                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                                                                            : 'bg-gradient-to-br from-amber-400 to-amber-600'
                                                                            }`}>
                                                                            {commentUsername.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className={`font-bold text-sm ${isCurrentUser ? 'text-green-400' : 'text-amber-400'
                                                                                }`}>
                                                                                {commentUsername}
                                                                                {isCurrentUser && <span className="text-xs mr-1">(أنت)</span>}
                                                                            </p>
                                                                            {c.createdAt && (
                                                                                <p className="text-xs text-gray-500">
                                                                                    {new Date(c.createdAt).toLocaleDateString('ar-EG', {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-gray-200 leading-relaxed pr-10">
                                                                        {c.commentText}
                                                                    </p>
                                                                </div>
                                                                {user?.role === 'admin' && (
                                                                    <button
                                                                        onClick={() => deleteComment(c._id)}
                                                                        className="p-2 text-red-500 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
                                                                        title="حذف التعليق"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Works Section */}
                {similarMovies.length > 0 && (
                    <div className="container mx-auto px-4 py-12 border-t border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-white border-r-4 border-amber-400 pr-4">
                                أعمال مشابهة قد تعجبك
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {similarMovies.map((movie) => {
                                const ratingData = getMovieRating(movie._id);
                                const movieWithRating = {
                                    ...movie,
                                    rating: ratingData.average
                                };
                                return (
                                    <MediaCard
                                        key={movie._id}
                                        work={movieWithRating}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
};

export default Details;