import React, { useState } from "react";
import { Button } from "../components/variants/button";
import Footer from "../components/Footer";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Send,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Form
interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const ContactPage = () => {
  // 1. Quản lý State riêng cho trang này
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Xử lý Gửi form (Giả lập gọi API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập độ trễ mạng (1.5 giây)
    setTimeout(() => {
      alert(`Thank you, ${formData.name}! We have received your message.`);
      setFormData({ name: "", phone: "", email: "", message: "" }); // Reset form
      setIsSubmitting(false);
    }, 1500);
  };

  // Class CSS dùng chung cho input để code gọn hơn
  const inputClasses =
    "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3.5 transition-all duration-200 outline-none";

  return (
    <div className="min-h-screen bg-white">
      {/* --- HEADER TITLE SECTION --- */}
      <div className="bg-gray-50 py-16 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight uppercase mb-4">
          Get in Touch
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg px-4">
          Have questions about our products, shipping, or just want to say
          hello? We'd love to hear from you.
        </p>
      </div>

      {/* --- MAIN CONTENT: CONTACT CARD --- */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
          {/* LEFT SIDE: INFO (Dark Theme) */}
          <div className="lg:w-5/12 bg-zinc-900 text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-[80px]"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-10 tracking-wide">
                Contact Information
              </h3>

              <div className="space-y-8">
                {/* Info Item 1 */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <MapPin className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gray-100 text-lg">
                      Visit Us
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      121 Tran Dai Nghia St, Dong Da Dist,
                      <br />
                      Hanoi, Vietnam
                    </p>
                  </div>
                </div>

                {/* Info Item 2 */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Phone className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gray-100 text-lg">
                      Call Us
                    </h4>
                    <p className="text-gray-400 text-sm">+84 648 559 25</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Mon-Fri from 8am to 5pm.
                    </p>
                  </div>
                </div>

                {/* Info Item 3 */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Mail className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-gray-100 text-lg">
                      Email Us
                    </h4>
                    <p className="text-gray-400 text-sm">
                      cuongmerlin@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="relative z-10 mt-16">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {[Facebook, Instagram, Youtube, Twitter].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM (Light Theme) */}
          <div className="lg:w-7/12 p-10 lg:p-14 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Send us a message
            </h3>
            <p className="text-gray-500 mb-10">
              Your email address will not be published. Required fields are
              marked *
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    className={inputClasses}
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    className={inputClasses}
                    type="tel"
                    name="phone"
                    placeholder="+84 ..."
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <input
                  className={inputClasses}
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Message *
                </label>
                <textarea
                  className={inputClasses}
                  placeholder="How can we help you?"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-zinc-800 py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default ContactPage;
