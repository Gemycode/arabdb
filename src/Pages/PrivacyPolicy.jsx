import Footer from "../componet/Footer";
import Navbar from "../componet/Navbar";
import logo from "../assets/WhatsApp_Image_2025-09-01_at_19.08.17_1b74120e-removebg-preview.png";
function PrivacyPolicy() {
    return (
        <>

            <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen ">
                <Navbar />

                {/* شعار الموقع */}
                <div className="flex flex-col justify-center items-center my-10">
                    <img src={logo} alt="Logo" width={120} className="mb-6 animate-bounce" />
                </div>

                {/* بطاقة سياسة الخصوصية */}
                <div
                    className="max-w-5xl mx-auto p-12 space-y-12 bg-gray-900 rounded-2xl shadow-xl mb-10"
                    style={{ fontFamily: 'Cairo, sans-serif', color: '#f5f5f5' }}
                >
                    <h1 className="text-5xl font-bold text-amber-400 drop-shadow-lg text-center">
                        سياسة الخصوصية - ArabFilmDB
                    </h1>

                    {/* Section 1 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            1. البيانات التي نقوم بجمعها
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed ">
                            قد نقوم بجمع معلومات مثل الاسم، البريد الإلكتروني، عنوان IP، نوع الجهاز، وسجل التصفح داخل الموقع.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            2. كيفية استخدام البيانات
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            نستخدم بياناتك لتحسين خدماتنا، تخصيص تجربة المستخدم، إرسال إشعارات، وتحليل أداء الموقع.
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            3. مشاركة البيانات
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            لا نقوم ببيع أو مشاركة بيانات المستخدم مع أي جهة خارجية إلا إذا تطلب الأمر قانونيًا، أو لحماية حقوقنا.
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            4. الحماية الأمنية
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed ">
                            نستخدم إجراءات أمان تقنية وإدارية لحماية بيانات المستخدم من الوصول غير المصرح به أو التعديل أو الحذف.
                        </p>
                    </div>

                    {/* Section 5 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            5. الكوكيز
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            نستخدم ملفات تعريف الارتباط لتحليل سلوك الزوار وتحسين الأداء. يحق لك رفض الكوكيز من إعدادات المتصفح.
                        </p>
                    </div>

                    {/* Section 6 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            6. حقوق المستخدم
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            لك الحق في طلب الاطلاع على بياناتك أو تعديلها أو حذفها في أي وقت عبر التواصل معنا.
                        </p>
                    </div>

                    {/* Section 7 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            7. مدة الاحتفاظ بالبيانات
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            نحتفظ بالبيانات طالما أن حسابك نشط أو حسب ما تقتضيه القوانين.
                        </p>
                    </div>

                    {/* Section 8 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            8. التحديثات
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            قد نقوم بتعديل سياسة الخصوصية، وسيتم إعلامك بأي تغييرات من خلال هذه الصفحة.
                        </p>
                    </div>

                    {/* Section 9 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 tracking-wide hover:text-amber-400 transition-all duration-300">
                            9. تواصل معنا
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            لأي استفسارات أو طلبات تتعلق ببياناتك، راسلنا على: <span className="text-amber-400 font-semibold">contact@arabfilmdb.com</span>
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
export default PrivacyPolicy;