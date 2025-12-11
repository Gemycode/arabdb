import Footer from "../componet/Footer";
import Navbar from "../componet/Navbar";
import logo from "../assets/WhatsApp_Image_2025-09-01_at_19.08.17_1b74120e-removebg-preview.png";
import { motion } from "framer-motion";

function AboutAs() {
    return (
        <div
            className="min-h-screen bg-black"
            style={{ fontFamily: "Cairo, sans-serif" }}
        >
            <Navbar />

            {/* Logo */}
            <div className="flex justify-center items-center flex-col py-14">
                <motion.img
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={logo}
                    alt="Logo"
                    className="w-[120px] drop-shadow-xl"
                />
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="max-w-6xl mx-auto px-6 py-12 space-y-10 mb-24 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-3xl shadow-2xl border border-neutral-800"
            >

                {/* Title */}
                <h1 className="text-amber-500 text-4xl md:text-5xl font-bold text-center">
                    عن منصة ArabFilmDB
                </h1>

                {/* Description */}
                <p className="text-white text-lg md:text-2xl leading-loose">
                    ArabFilmDB منصة سعودية حديثة تُعنى بتجميع وتوثيق الأعمال الفنية العربية بمختلف أنواعها، من أفلام ومسلسلات وبرامج، إضافة إلى
                    صناع المحتوى من ممثلين ومخرجين وكتّاب، وذلك ضمن قاعدة بيانات موحدة تعتمد الدقة والسهولة في الوصول للمعلومة.
                </p>

                <p className="text-white text-lg md:text-2xl leading-loose">
                    يمثل المشروع مبادرة سعودية شبابية تسعى إلى بناء مرجع موثوق يحفظ الإرث المرئي العربي ويقدمه للجمهور والمحترفين بأسلوب معاصر،
                    وتم تطويره بالشراكة مع خبير تقني مصري ساهم في بناء الأساسات البرمجية للموقع.
                </p>

                <p className="text-white text-lg md:text-2xl leading-loose">
                    انطلقت الفكرة في 26 يوليو 2025 وتحوّلت إلى مشروع عملي في 1 أغسطس 2025، بجهود فردية ورؤية واضحة لإنشاء مركز معرفي رقمي متخصص
                    يعكس تطور الصناعة الفنية في المنطقة.
                </p>

                <p className="text-white text-lg md:text-2xl leading-loose">
                    تعمل المنصة على تقديم محتوى دقيق ومحدّث يشمل:
                </p>

                {/* List */}
                <ul className="text-white text-lg md:text-2xl list-disc list-inside leading-loose space-y-2">
                    <li>بيانات الأعمال الفنية</li>
                    <li>السير المهنية لصناع المحتوى</li>
                    <li>التقييمات</li>
                    <li>الصور والبوسترات</li>
                    <li>نبذات مختصرة</li>
                    <li>روابط الإعلانات الرسمية</li>
                    <li>طاقم العمل والمشاركين</li>
                </ul>

                <p className="text-white text-lg md:text-2xl leading-loose">
                    وذلك بأسلوب تفاعلي يسهّل الاستكشاف والتوثيق والمشاركة.
                </p>

                <p className="text-white text-lg md:text-2xl leading-loose">
                    ويتقدم فريق ArabFilmDB بالشكر للمبرمجين تقديراً لجهودهم التقنية ودعمهم في بناء هيكل المنصة.
                </p>

                {/* Developers */}
                <h2 className="text-center text-3xl text-amber-400 font-bold pt-6">
                    فريق التطوير
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mt-8">

                    {/* Card */}
                    {[
                        { name: "محمود مرسي" },
                        { name: "عبدالله جمال" },
                        { name: "عبدالله أحمد" }
                    ].map((dev, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center justify-center p-6 rounded-2xl
                            bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f]
                            shadow-lg border border-neutral-800 hover:border-amber-400 transition-all"
                        >
                            <div className="text-5xl mb-4">👨‍💻</div>
                            <h3 className="text-white text-2xl font-bold mb-1">
                                {dev.name}
                            </h3>
                            <p className="text-gray-400 text-lg">
                                Full Stack Developer
                            </p>
                        </motion.div>
                    ))}

                </div>

                {/* Contact */}
                <p className="text-white text-xl md:text-2xl text-center pt-10 font-semibold">
                    للاقتراحات أو التواصل:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">

                    {/* Email */}
                    <div className="bg-[#111] p-6 rounded-2xl shadow-lg border border-neutral-700 hover:border-amber-500 transition-all text-center">
                        <p className="text-gray-400 text-lg mb-2">الإيميل</p>
                        <a
                            href="mailto:info@arabfilmdb.com"
                            className="text-amber-500 text-xl font-semibold hover:underline"
                        >
                            info@arabfilmdb.com
                        </a>
                    </div>

                    {/* Contact Page */}
                    <div className="bg-[#111] p-6 rounded-2xl shadow-lg border border-neutral-700 hover:border-amber-500 transition-all text-center">
                        <p className="text-gray-400 text-lg mb-2">نموذج التواصل</p>
                        <a
                            href="/Contact"
                            className="text-amber-500 text-xl font-semibold hover:underline"
                        >
                            اضغط هنا للتواصل معنا
                        </a>
                    </div>

                </div>

            </motion.div>

            <Footer />
        </div>
    );
}

export default AboutAs;
