import type { ProductSummary } from "./ProductCard";
import { Tabs, TabsList, TabsTrigger } from "./Tab";
import { Button } from "./variants/button";
import ProductCard from "./ProductCard";
import { Link } from "react-router"; // Sử dụng react-router-dom chuẩn

interface FeatureProp {
  featuredTab: string;
  setFeaturedTab: (value: string) => void;
  featuredProducts: ProductSummary[];
}

const Featured = ({
  featuredTab,
  setFeaturedTab,
  featuredProducts,
}: FeatureProp) => {
  return (
    <section className="w-full py-20 bg-white">
      {" "}
      {/* Nền trắng để phân biệt với phần Hot (nền xám nhạt) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          {/* Title & Subtitle */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              FEATURED PRODUCTS
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Hand-picked styles for every occasion.
            </p>
          </div>

          {/* Tabs & Action */}
          <div className="flex flex-col xl:flex-row items-center gap-4 w-full md:w-auto">
            <Tabs
              value={featuredTab}
              onValueChange={setFeaturedTab}
              className="w-full md:w-auto"
            >
              {/* TabsList: Dùng flex-wrap để xuống dòng nếu nhiều category quá */}
              <TabsList className="flex flex-wrap justify-center md:justify-start gap-2 h-auto bg-transparent p-0">
                {/* Danh sách các Tab */}
                {[
                  { value: "Men Polos", label: "Polos" },
                  { value: "Men Sweater", label: "Sweater" },
                  { value: "Men Hoodies", label: "Hoodies" },
                  { value: "Men Jeans", label: "Jeans" },
                  { value: "Women Skirts", label: "Skirts" },
                  { value: "Women Tops", label: "Tops" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition-all 
                    data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black
                    hover:border-gray-400"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
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
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-sm">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Collection Empty
            </h3>
            <p className="text-gray-500 max-w-sm mt-2">
              We're currently restocking our {featuredTab} collection. Check out
              our other categories!
            </p>
          </div>
        )}

        {/* Mobile View All Button */}
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

export default Featured;
