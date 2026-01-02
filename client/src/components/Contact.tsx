import { Button } from "./variants/button";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";
import type { FormData } from "../App";


interface ContactProp {
  handleSubmitContact: (e: React.FormEvent) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Contact = ({
  handleSubmitContact,
  formData,
  setFormData,
}: ContactProp) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData: FormData) => ({
      ...prevFormData,
      [name as keyof FormData]: value,
    }));
  };

  // Class chung cho Input để code gọn hơn
  const inputClasses =
    "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-all duration-200 outline-none";

  return (
    <section id="contact" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase mb-3">
            Contact Us
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We'd love to hear from you. Whether you have a question about
            shipping, pricing, or styling, our team is ready to help.
          </p>
        </div>

        {/* --- CONTACT CARD WRAPPER --- */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
          {/* LEFT SIDE: INFO (Dark Theme) */}
          <div className="lg:w-5/12 bg-zinc-900 text-white p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background Pattern Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-200">
                      Visit Us
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      121 Tran Dai Nghia St, Dong Da Dist,
                      <br />
                      Hanoi, Vietnam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-200">
                      Call Us
                    </h4>
                    <p className="text-gray-400 text-sm">+84 648 559 25</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-200">
                      Email Us
                    </h4>
                    <p className="text-gray-400 text-sm">
                      cuongmerlin@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-200">
                      Working Hours
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Mon - Fri: 9AM - 8PM
                    </p>
                    <p className="text-gray-400 text-sm">
                      Sat - Sun: 10AM - 6PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="relative z-10 mt-12">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {[Facebook, Instagram, Youtube, Twitter].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM (Light Theme) */}
          <div className="lg:w-7/12 p-10 lg:p-12 bg-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Send us a message
            </h3>
            <p className="text-gray-500 mb-8 text-sm">
              Your email address will not be published. Required fields are
              marked *
            </p>

            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
                className="w-full bg-black text-white hover:bg-zinc-800 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
