import { Award, Shield, Users, Target, Leaf } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* --- SECTION 1: HERO STORY (Ảnh + Chữ) --- */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Cột Ảnh (Trái) */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                alt="Adam de Adam Studio"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay mờ nhẹ */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            {/* Họa tiết trang trí */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-50 rounded-full -z-10"></div>
          </div>

          {/* Cột Nội dung (Phải) */}
          <div className="w-full lg:w-1/2">
            <h4 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3">
              Our Story
            </h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Crafting Fashion <br /> Since 2020.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Adam de Adam is a premium fashion brand dedicated to bringing you
              the finest collection of contemporary and classic styles. What
              started as a small studio in Hanoi has grown into a community of
              style enthusiasts who value quality above all else.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              We believe that fashion is not just about clothing—it's about
              expressing your unique personality and confidence without saying a
              word.
            </p>

            {/* Chữ ký (Optional - tạo cảm giác cá nhân) */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-black"></div>
              <span className="font-serif italic text-xl text-gray-800">
                Adam Founder
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: STATS (Dải thống kê) --- */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
            <div>
              <div className="text-4xl font-bold mb-2 text-indigo-400">
                20k+
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-indigo-400">
                100%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Authentic
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-indigo-400">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Brands
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-indigo-400">
                24/7
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CORE VALUES (Giá trị cốt lõi) --- */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-500">
            We are committed to sustainable practices and ethical sourcing. Here
            is what makes Adam de Adam different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Value 1 */}
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
              <Award className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Premium Quality
            </h3>
            <p className="text-gray-500 leading-relaxed">
              We carefully select fabrics that ensure comfort and durability.
              Every stitch tells a story of craftsmanship.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
              <Leaf className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Sustainability
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Fashion that looks good and does good. We focus on eco-friendly
              materials and ethical production processes.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Community First
            </h3>
            <p className="text-gray-500 leading-relaxed">
              We build more than just a brand; we build a community. Join us and
              discover your unique style journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
