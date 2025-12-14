import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogOut, PlusCircle, Play } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, setSelectedItem } from '../redux/moviesSlice';
import logo from '../assets/WhatsApp_Image_2025-09-01_at_19.08.17_1b74120e-removebg-preview.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const searchRef = useRef(null);

    const [open, setOpen] = useState(false);
    // Safely read user from localStorage and compute avatar/initials
    const storedUserRaw = localStorage.getItem('user');
    let user = null;
    try {
        user = storedUserRaw ? JSON.parse(storedUserRaw) : null;
    } catch (e) {
        user = null;
    }

    // avatarSrc: ensure it's a string URL. support either a string or an object with .url
    let avatarSrc = null;
    if (user) {
        if (typeof user.profileImage === 'string' && user.profileImage.trim() !== '') {
            avatarSrc = user.profileImage;
        } else if (user.profileImage && typeof user.profileImage.url === 'string' && user.profileImage.url.trim() !== '') {
            avatarSrc = user.profileImage.url;
        } else {
            avatarSrc = null;
        }
    }
    const displayName = user?.username || user?.name || (user?.email ? user.email.split('@')[0] : 'User');
    const initials = (displayName || 'U').replace(/\s+/g, '').slice(0, 2).toUpperCase();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Get all works from Redux
    const { allMovies } = useSelector(state => state.movies);
    // console.log(user.data);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Search functionality
    useEffect(() => {
        if (search.trim().length > 0) {
            const filtered = allMovies.filter(item =>
                item.nameArabic?.toLowerCase().includes(search.toLowerCase()) ||
                item.nameEnglish?.toLowerCase().includes(search.toLowerCase())
            ).slice(0, 5); // Show only top 5 results
            setSearchResults(filtered);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [search, allMovies]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSearchItemClick = (itemId) => {
        const item = searchResults.find(i => i._id === itemId);
        if (item) {
            dispatch(setSelectedItem(item));
        }
        setShowSearchResults(false);
        setSearch('');
        navigate(`/Details/${itemId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
                closeMobileMenu();
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/Login');
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                closeMobileMenu();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div dir="rtl" className="relative w-full z-50">
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${scrolled
                    ? 'bg-[#0f1014]/95 backdrop-blur-xl shadow-2xl'
                    : 'bg-transparent backdrop-blur-sm'
                    }`}
                style={{ height: '120px' }}
            >
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
                    <div className="flex justify-between items-center h-full">

                        {/* Logo Section */}
                       <div
                            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigate('/')}
                            >
                            <div className="relative">
                                <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <img
                                src={logo}
                                alt="Logo"
                                className="
                                    object-contain relative z-10
                                    transition-transform duration-500 group-hover:scale-110
                                    drop-shadow-2xl
                                    w-12 h-12          /* mobile */
                                    sm:w-14 sm:h-14    /* small screens */
                                    md:w-16 md:h-16    /* tablets */
                                    lg:w-20 lg:h-20    /* laptops */
                                    xl:w-24 xl:h-24    /* large screens */
                                "
                                />
                            </div>
                      </div>


                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
                            <ul className="flex items-center gap-8">
                                {[
                                    { name: 'الرئيسية', path: '/' },
                                    { name: 'الافلام', path: '/MovieFilterDemo' },
                                    { name: 'المسلسلات', path: '/SeriesFilterDemo' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className={`relative px-4 py-2 text-base font-bold transition-all duration-300 group ${location.pathname === item.path ? 'text-amber-400' : 'text-gray-300 hover:text-white'
                                                }`}
                                        >
                                            <span className="relative z-10">{item.name}</span>
                                            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                                                }`}></span>
                                            <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Search Bar with Dropdown */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-4" ref={searchRef}>
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    placeholder="ابحث عن فيلم أو مسلسل..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pr-12 pl-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 focus:ring-1 focus:ring-amber-500/20 transition-all duration-300"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => search.trim().length > 0 && setShowSearchResults(true)}
                                />
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-amber-400 transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>

                                {/* Search Results Dropdown */}
                                {showSearchResults && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                                        {searchResults.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => handleSearchItemClick(item._id)}
                                                className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-all duration-200 border-b border-white/5 last:border-b-0"
                                            >
                                                <img
                                                    src={item.posterUrl}
                                                    alt={item.nameArabic}
                                                    className="w-12 h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/48x64/1f2937/9ca3af?text=No+Image';
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-white font-semibold text-sm line-clamp-1">{item.nameArabic}</h4>
                                                    <p className="text-gray-400 text-xs line-clamp-1">{item.nameEnglish}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                                                            {item.type === 'movie' ? 'فيلم' : 'مسلسل'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{item.year}</span>
                                                    </div>
                                                </div>
                                                <Play size={16} className="text-amber-400" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No Results Message */}
                                {showSearchResults && search.trim().length > 0 && searchResults.length === 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                                        <p className="text-gray-400 text-sm text-center">لا توجد نتائج للبحث عن "{search}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {!user ? (
                                <>
                                    <button
                                        onClick={() => navigate('/Login')}
                                        className="text-white hover:text-amber-400 font-medium text-sm transition-colors duration-300"
                                    >
                                        تسجيل الدخول
                                    </button>
                                    <button
                                        onClick={() => navigate('/Register')}
                                        className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <span className="relative z-10">إنشاء حساب</span>
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </button>
                                </>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group"
                                    >
                                        {avatarSrc ? (
                                            <img
                                                src={avatarSrc}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg text-xs">
                                                {initials}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">
                                            {displayName}
                                        </span>
                                        <User className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {open && (
                                        <div className="absolute left-0 mt-4 w-56 rounded-2xl bg-[#1a1c23] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200 z-50">
                                            <div className="p-2 space-y-1">
                                                <button
                                                    onClick={() => navigate("/profile")}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                                                >
                                                    <User className="w-4 h-4" />
                                                    الملف الشخصي
                                                </button>

                                                {(user?.role === 'admin' || user?.role === 'publisher') && (
                                                    <button
                                                        onClick={() => navigate("/dashboard")}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                                                    >
                                                        <PlusCircle className="w-4 h-4" />
                                                        لوحة التحكم
                                                    </button>
                                                )}

                                                <div className="h-px bg-white/10 my-1"></div>

                                                <button
                                                    onClick={logout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    تسجيل خروج
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-4 relative z-50">
                            <button
                                onClick={toggleMobileMenu}
                                className="mobile-menu-button p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`lg:hidden fixed inset-0 top-[120px] z-30 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={closeMobileMenu}
                ></div>

                {/* Mobile Menu Content */}
                <div
                    className={`mobile-menu lg:hidden fixed top-[120px] left-0 w-full h-[calc(100vh-120px)] bg-[#13151a] border-t border-white/10 shadow-2xl transition-all duration-300 z-40 overflow-y-auto ${isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-2 opacity-0 pointer-events-none'
                        }`}
                >
                    <div className="flex flex-col p-6 min-h-full">

                        {/* Mobile Search */}
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ابحث..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Search Results */}
                            {search.trim().length > 0 && searchResults.length > 0 && (
                                <div className="mt-2 bg-[#1a1c23] border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                                    {searchResults.map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => { handleSearchItemClick(item._id); closeMobileMenu(); }}
                                            className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-all duration-200 border-b border-white/5 last:border-b-0"
                                        >
                                            <img
                                                src={item.posterUrl}
                                                alt={item.nameArabic}
                                                className="w-10 h-14 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/40x56/1f2937/9ca3af?text=No+Image';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold text-sm line-clamp-1">{item.nameArabic}</h4>
                                                <p className="text-gray-400 text-xs line-clamp-1">{item.nameEnglish}</p>
                                                <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full inline-block mt-1">
                                                    {item.type === 'movie' ? 'فيلم' : 'مسلسل'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 flex-1">
                            {[
                                { name: 'الرئيسية', path: '/' },
                                { name: 'الافلام', path: '/MovieFilterDemo' },
                                { name: 'المسلسلات', path: '/SeriesFilterDemo' }
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => { navigate(item.path); closeMobileMenu(); }}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${location.pathname === item.path
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span className="font-bold">{item.name}</span>
                                    <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            ))}

                            {(user?.role === 'admin' || user?.role === 'publisher') && (
                                <button
                                    onClick={() => { navigate('/dashboard'); closeMobileMenu(); }}
                                    className="w-full flex items-center justify-between p-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
                                >
                                    <span className="flex items-center gap-3 font-bold">
                                        <PlusCircle className="w-5 h-5" />
                                        لوحة التحكم
                                    </span>
                                </button>
                            )}
                            <button
                                onClick={() => { navigate('/Profile'); closeMobileMenu(); }}
                                className="w-full flex items-center justify-between p-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
                            >
                                <span className="flex items-center gap-3 font-bold">
                                    <User className="w-5 h-5" />
                                    الملف الشخصي
                                </span>
                            </button>
                        </div>

                        {/* Mobile User Actions */}
                        <div className="mt-8 pt-8 border-t border-white/10">
                            {!user ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { navigate('/Login'); closeMobileMenu(); }}
                                        className="w-full py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                    >
                                        تسجيل الدخول
                                    </button>
                                    <button
                                        onClick={() => { navigate('/Register'); closeMobileMenu(); }}
                                        className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                                    >
                                        إنشاء حساب
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                                        {avatarSrc ? (
                                            <img
                                                src={avatarSrc}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                                {initials}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-bold">{displayName}</p>
                                            <p className="text-xs text-gray-400">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        تسجيل خروج
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* Spacer to prevent content overlap since navbar is fixed */}
            <div className="h-32 lg:h-36"></div>
        </div>
    );
};

export default Navbar;