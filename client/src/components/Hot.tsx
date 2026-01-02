import { Button } from "./variants/button";
import ProductCard from "./ProductCard";
import type { ProductSummary } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./Tab";
import { Link } from "react-router"; // Lưu ý: Thường là react-router-dom
 // Icon mũi tên (nếu bạn có cài lucide-react)

interface HotProp {
  whatsHotProducts: ProductSummary[];
  whatsHotTab: string;
  setWhatsHotTab: (value: string) => void;
}

const Hot = ({ whatsHotProducts, whatsHotTab, setWhatsHotTab }: HotProp) => {
  return (
    <section className="w-full py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          {/* Title & Subtitle */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              WHAT'S HOT
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Discover the latest trends and our most loved items.
            </p>
          </div>

          {/* Tabs & Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Tabs
              value={whatsHotTab}
              onValueChange={setWhatsHotTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-white border border-gray-200 p-1 rounded-full shadow-sm">
                <TabsTrigger
                  value="new"
                  className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white px-6 transition-all"
                >
                  New
                </TabsTrigger>
                <TabsTrigger
                  value="best seller"
                  className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white px-6 transition-all"
                >
                  Best Sellers
                </TabsTrigger>
                <TabsTrigger
                  value="sale"
                  className="rounded-full data-[state=active]:bg-black data-[state=active]:text-white px-6 transition-all"
                >
                  Sale
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Desktop View All Button */}
            <div className="hidden md:block">
              <Link to="/products">
                <Button
                  variant="ghost"
                  className="group gap-2 hover:bg-transparent hover:text-indigo-600 transition-colors"
                >
                  View All
                  {/* Icon mũi tên tạo cảm giác điều hướng */}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {whatsHotProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {whatsHotProducts.map((product) => (
              <div key={product.id} className="animate-fade-in-up">
                {" "}
                {/* Class này cần config tailwind hoặc CSS */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - Nhìn đẹp hơn khi chưa có dữ liệu */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="text-gray-500 max-w-sm mt-2">
              We couldn't find any items in this collection right now. Please
              check back later.
            </p>
          </div>
        )}

        {/* Mobile View All Button (Chỉ hiện ở dưới cùng trên màn hình nhỏ) */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link to="/products">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 border-gray-300"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hot;
