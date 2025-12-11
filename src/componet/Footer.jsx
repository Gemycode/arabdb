import logo from "/src/assets/WhatsApp_Image_2025-09-01_at_19.08.17_1b74120e-removebg-preview.png";
import { useNavigate } from 'react-router-dom';
import logoo from "/src/assets/Screenshot 2025-12-10 153424.png";
function Footer() {
    const navigate = useNavigate();
    return (
        <footer className="bg-card border-t border-width-1 border-white/10 " style={{ backgroundColor: 'var(--color-dark)', color: '#a1a1a1' }}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <img
                                src={logo}
                                alt="Logo"
                                width={128}
                                height={128}
                                className="w-32 h-32 object-contain drop-shadow-lg transition-shadow duration-300 group-hover:drop-shadow-2xl"
                                loading="eager"
                            />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            قاعدة البيانات الأكثر شمولية للأفلام والمسلسلات العربية والخليجية. اكتشف أحدث الإنتاجات، اقرأ المراجعات، وشارك آرائك مع مجتمع محبي السينما العربية.
                        </p>
                        <div className="flex space-x-4 space-x-reverse">
                            {/* TikTok */}
                            <a
                                href="https://www.tiktok.com/@arabfilmdb"
                                className="text-lg hover:text-amber-300 transition-colors p-2 hover-glow rounded-lg"
                                aria-label="تيك توك"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="35"
                                    height="35"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M16.5 3.5c.7 1.1 1.8 2 3.1 2.2v3c-1.6-.1-3.1-.7-4.4-1.7v7.9c0 3.1-2.5 5.6-5.6 5.6S4 18.9 4 15.8s2.5-5.6 5.6-5.6c.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.2-1.2-.2-1.4 0-2.5 1.1-2.5 2.5S7.2 19 8.6 19s2.5-1.1 2.5-2.5V5h3.4c.1 1.1.4 2.1 1 3z" />
                                </svg>
                            </a>


                            {/* Twitter */}
                            <a href="https://x.com/arabfilmdb" className="text-lg hover:text-amber-300 transition-colors p-2 hover-glow rounded-lg" aria-label="تويتر">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="lucide lucide-twitter" aria-hidden="true">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a href="https://www.instagram.com/arabfilmdb" className="text-lg hover:text-amber-300 transition-colors p-2 hover-glow rounded-lg" aria-label="إنستغرام">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="lucide lucide-instagram" aria-hidden="true">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                </svg>
                            </a>

                            {/* YouTube */}
                            <a href="https://youtube.com/@ArabfilmDB?feature=shared" className=" hover:text-amber-300 transition-colors p-2 rounded-lg hover-glow"
                                aria-label="يوتيوب">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="lucide lucide-youtube" aria-hidden="true">
                                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                                    <path d="m10 15 5-3-5-3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">روابط سريعة</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    href="/"
                                    data-discover="true"
                                >
                                    الرئيسية
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    href="/MovieFilterDemo"
                                    data-discover="true"
                                >
                                    الأفلام
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    href="/SeriesFilterDemo"
                                    data-discover="true"
                                >
                                    المسلسلات
                                </a>
                            </li>

                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">الدعم والمساعدة</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    href="/AboutAs"
                                    data-discover="true"
                                >
                                    عن الموقع
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    href="/contact"
                                    data-discover="true"
                                >
                                    تواصل معنا
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    onClick={() => navigate('/Termsofuse')}
                                >
                                    الشروط والأحكام
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    onClick={() => navigate('/PrivacyPolicy')}
                                    data-discover="true"
                                >
                                    سياسة الاستخدام
                                </a>
                            </li>

                            <li>
                                <a
                                    className="text-muted-foreground hover:text-primary transition-colors text-xl"
                                    onClick={() => navigate('/IntellectualPropertyRights')}
                                    data-discover="true"
                                >
                                    حقوق الملكية الفكرية
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">تواصل معنا</h3>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 space-x-reverse text-xl text-muted-foreground">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-mail text-amber-300 mx-3"
                                    aria-hidden="true"
                                >
                                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                </svg>
                                <a href="mailto:info@arabfilmdb.com" className="font-bold text-white hover:underline">
                                    info@arabfilmdb.com
                                </a>
                            </div>

                            <div className="flex items-center space-x-3 space-x-reverse text-xl text-muted-foreground">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-phone text-amber-300 mx-3"
                                    aria-hidden="true"
                                >
                                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                                </svg>
                                <a href="tel:+966535815418" className="font-bold">
                                    966535815418+
                                </a>

                            </div>
                            <div className="-mt-24">

                                <a href="https://eauthenticate.saudibusiness.gov.sa/certificate-details/0000206253">
                                    <img
                                        src={logoo}
                                        alt="Logo"
                                        width={128}
                                        height={128}
                                        className="w-100 h-100 object-contain drop-shadow-lg transition-shadow duration-300 group-hover:drop-shadow-2xl"
                                        loading="eager"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 py-8 border-t border-width-1 border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-muted-foreground">
                        © 2025 ArabFilmDB. جميع الحقق محفوظة.
                    </p>
                    <div className="flex space-x-6 space-x-reverse text-sm">
                        <a
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => navigate('/Termsofuse')}
                        >
                            الشروط والأحكام
                        </a>
                        <a
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => navigate('/PrivacyPolicy')}
                        >
                            سياسة الخصوصية
                        </a>
                        <a
                            className="text-muted-foreground hover:text-primary transition-colors mx-4"
                            href="/contact"
                        >
                            تواصل معنا
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
