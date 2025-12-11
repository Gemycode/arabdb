import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
} from "lucide-react";
import "../App.css";
import Footer from "../componet/Footer";
import Navbar from "../componet/Navbar";
import { contactService } from "../api/contactService";

function Contact() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "اسم المستخدم مطلوب";

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.message.trim()) newErrors.message = "الرسالة مطلوبة";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        await contactService.sendContactForm({
          name: formData.username,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        });

        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            username: "",
            email: "",
            phone: "",
            message: "",
          });
        }, 3000);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Optionally handle server errors here, e.g., setErrors based on response
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-white">
      <Navbar />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">

          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 text-[var(--color-accent)]">
              تواصل معنا
            </h3>
            <p className="text-gray-300 text-lg">
              نحن هنا للاستماع إليك ومساعدتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center bg-[var(--color-dark)] p-6 rounded-xl shadow hover:shadow-lg transition">
              <Mail className="text-[var(--color-accent)] mb-3" size={32} />
              <h4 className="font-semibold text-lg mb-1">البريد الإلكتروني</h4>
              <a href="mailto:info@arabfilmdb.com" className="text-gray-400 hover:text-amber-300 transition-colors">
                info@arabfilmdb.com
              </a>
            </div>
            <div className="flex flex-col items-center bg-[var(--color-dark)] p-6 rounded-xl shadow hover:shadow-lg transition">
              <Phone className="text-[var(--color-accent)] mb-3" size={32} />
              <h4 className="font-semibold text-lg mb-1">الهاتف</h4>
              <a
                href="tel:+966535815418"
                className="text-gray-400 hover:text-amber-300 transition-colors"
              >
                966535815418+
              </a>
            </div>
            <div className="flex flex-col items-center bg-[var(--color-dark)] p-6 rounded-xl shadow hover:shadow-lg transition">
              <MapPin className="text-[var(--color-accent)] mb-3" size={32} />
              <h4 className="font-semibold text-lg mb-1">العنوان</h4>
              <p className="text-gray-400">الرياض، المملكة العربية السعودية</p>
            </div>
          </div>


          <div className="bg-[var(--color-dark)] rounded-xl p-8 shadow-lg">
            {isSubmitted ? (
              <div className="text-center py-8 bg-green-600/20 border border-green-500 rounded-lg">
                <h4 className="text-green-400 text-xl font-semibold mb-2">
                  تم إرسال الرسالة بنجاح!
                </h4>
                <p className="text-gray-300">
                  شكراً لتواصلك معنا، سنقوم بالرد عليك قريباً
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm">
                    اسم المستخدم
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم المستخدم"
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-secondary)] text-white border border-[var(--color-grayy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-secondary)] text-white border border-[var(--color-grayy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm">
                    رقم الهاتف
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966 50 123 4567"
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-secondary)] text-white border border-[var(--color-grayy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm">
                    رسالتك
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-secondary)] text-white border border-[var(--color-grayy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[120px]"
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:opacity-90 transition"
                >
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>


          <div className="flex justify-center gap-6 mt-12">
            <a
              href="https://www.tiktok.com/@arabfilmdb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-amber-400 transition"
              aria-label="تيك توك"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.5 3.5c.7 1.1 1.8 2 3.1 2.2v3c-1.6-.1-3.1-.7-4.4-1.7v7.9c0 3.1-2.5 5.6-5.6 5.6S4 18.9 4 15.8s2.5-5.6 5.6-5.6c.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.2-1.2-.2-1.4 0-2.5 1.1-2.5 2.5S7.2 19 8.6 19s2.5-1.1 2.5-2.5V5h3.4c.1 1.1.4 2.1 1 3z" />
              </svg>
            </a>

            <a
              href="https://x.com/arabfilmdb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-sky-500 transition"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://www.instagram.com/arabfilmdb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-pink-500 transition"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://youtube.com/@ArabfilmDB?feature=shared"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-red-600 transition"
              aria-label="يوتيوب"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.1 5 12 5 12 5h0s-4.1 0-6.9.1c-.4 0-1.3 0-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 6.8.1 6.8.1s4.1 0 6.9-.1c.4 0 1.3 0 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2zM10 15V9l5 3-5 3z" />
              </svg>
            </a>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Contact;
