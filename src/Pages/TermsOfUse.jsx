import Footer from "../componet/Footer";
import Navbar from "../componet/Navbar";
import logo from "../assets/WhatsApp_Image_2025-09-01_at_19.08.17_1b74120e-removebg-preview.png";

function TermsOfUse() {
    return (
        <>
            <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
                <Navbar />

                {/* اللوجو */}
                <div className="flex flex-col justify-center items-center my-10">
                    <img
                        src={logo}
                        alt="Logo"
                        width={120}
                        className="mb-6 animate-bounce"
                    />
                </div>

                {/* الكارد الرئيسي */}
                <div
                    className="max-w-5xl mx-auto p-12 space-y-12 bg-gray-900 rounded-2xl shadow-2xl mb-10"
                    style={{ fontFamily: "Cairo, sans-serif", color: "#f5f5f5" }}
                >
                    <h1 className="text-5xl font-bold text-amber-400 drop-shadow-lg text-center">
                        شروط الاستخدام - ArabFilmDB
                    </h1>

                    {/* 1 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            1. المقدمة
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            باستخدامك لموقع ArabFilmDB، فإنك توافق على الالتزام الكامل
                            بالشروط والأحكام المنصوص عليها في هذه الاتفاقية. إذا لم توافق
                            على أي جزء من هذه الشروط، يجب عليك التوقف فورًا عن استخدام
                            الموقع.
                        </p>
                    </div>

                    {/* 2 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            2. الملكية الفكرية
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            جميع الحقوق المتعلقة بالمحتوى، والتصميم، والرمز البرمجي،
                            وقاعدة البيانات، والشعار، والعلامة التجارية لموقع ArabFilmDB
                            هي ملك حصري لصاحب المشروع، ولا يجوز إعادة إنتاجها أو
                            استخدامها دون إذن كتابي مسبق.
                        </p>
                    </div>

                    {/* 3 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            3. استخدام الموقع
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            يُحظر استخدام الموقع لأي نشاط غير قانوني أو ينتهك حقوق
                            الغير. كما يُمنع استخدام الموقع لنشر أو توزيع محتوى مسيء أو
                            مخل أو محمي بحقوق ملكية دون ترخيص.
                        </p>
                    </div>

                    {/* 4 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            4. دقة المحتوى
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            نحن نسعى لتقديم معلومات دقيقة، لكن لا نضمن خلوها من
                            الأخطاء أو التحديث الفوري. المستخدم يعتمد على المعلومات في
                            الموقع على مسؤوليته الشخصية.
                        </p>
                    </div>

                    {/* 5 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            5. الحسابات والمستخدمين
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            يجب على المستخدمين الحفاظ على سرية بيانات الدخول، وهم
                            مسؤولون عن جميع الأنشطة التي تتم عبر حساباتهم.
                        </p>
                    </div>

                    {/* 6 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            6. التعديلات
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق.
                            استمرار استخدام الموقع يعني موافقتك على التعديلات.
                        </p>
                    </div>

                    {/* 7 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            7. الإنهاء
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            يحق لإدارة الموقع تعليق أو إنهاء وصول أي مستخدم في حال
                            انتهاك الشروط دون إشعار مسبق.
                        </p>
                    </div>

                    {/* 8 */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-semibold text-amber-500 hover:text-amber-400 transition duration-300">
                            8. القانون المعمول به
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed  ">
                            تخضع هذه الاتفاقية لقوانين المملكة العربية السعودية، ويكون
                            الاختصاص القضائي لمحاكم مدينة تبوك.
                        </p>
                    </div>
                </div>

                <Footer />
            </div>

        </>
    );
}
export default TermsOfUse;
