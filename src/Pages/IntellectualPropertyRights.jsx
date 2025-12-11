import Footer from "../componet/Footer";
import Navbar from "../componet/Navbar";
import logo from "../assets/WhatsApp_Image_2025-09-01_at_19.08.17_1b74120e-removebg-preview.png";
function IntellectualPropertyRights() {
    return (

        <>

            <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
                <Navbar />

                <div className="flex flex-col justify-center items-center my-10">
                    <img
                        src={logo}
                        alt="Logo"
                        width={120}
                        className="mb-6 animate-pulse"
                    />
                </div>

                <div
                    className="max-w-4xl mx-auto p-12 space-y-10 bg-gray-900 rounded-2xl shadow-2xl mb-10"
                    style={{ fontFamily: "Cairo, sans-serif" }}
                >
                    <h1 className="text-5xl font-bold text-amber-400 text-center drop-shadow-lg">
                        إشعار الملكية الفكرية
                    </h1>

                    <p className="text-gray-300 text-lg leading-relaxed  ">
                        جميع المحتويات البرمجية والتصميمات الخاصة بموقع
                        <span className="text-amber-400 font-semibold"> ArabFilmDB </span>
                        مملوكة بالكامل لصاحب المشروع، وهي محمية بموجب قوانين حقوق الملكية
                        الفكرية المحلية والدولية.
                    </p>

                    <p className="text-gray-300 text-lg leading-relaxed  ">
                        نحن نحترم حقوق الملكية الفكرية. إذا كنت مالكاً لحقوق نشر وتعتقد أن
                        هناك انتهاكاً داخل الموقع، يرجى التواصل معنا عبر البريد:
                    </p>

                    <div className="text-center">
                        <a
                            href="mailto:contact@arabfilmdb.com"
                            className="text-amber-400 text-xl font-bold hover:text-amber-300 transition duration-300 underline"
                        >
                            info@arabfilmdb.com
                        </a>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed  ">
                        وسوف نقوم بمراجعة البلاغ واتخاذ الإجراء المناسب في أسرع وقت
                        ممكن.
                    </p>
                </div>

                <Footer />
            </div>
        </>
    );
}
export default IntellectualPropertyRights;