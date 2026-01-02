import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react"; // Có thể thay Package bằng Truck nếu thích

const Merit = () => {
  // 1. Tạo mảng dữ liệu để code gọn và dễ quản lý
  const features = [
    {
      icon: Truck, // Dùng icon Truck nhìn hợp với "Shipping" hơn Package
      title: "Fast Shipping",
      description: "Free delivery on all orders over $100.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day hassle-free return policy.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "100% secure and encrypted transactions.",
    },
  ];

  return (
    <section className="border-t border-gray-100 bg-gray-50/80 py-20">
      <div className="container mx-auto px-4">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center px-4 py-4 md:py-0 group transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
                  <Icon
                    strokeWidth={1.5} // Icon nét mảnh sang trọng hơn
                    className="h-7 w-7 text-gray-700 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300"
                  />
                </div>

                {/* Text Content */}
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Merit;
