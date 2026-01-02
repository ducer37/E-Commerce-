import ProductList from "../components/ProductList";
import type { ProductSummary } from "../components/ProductCard";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";
import { ErrorDisplay } from "../components/ErrorDisplay";
import LoadingSpinner from "../components/LoadingSpinner";

export interface Category {
  id: number;
  name: string;
  image: string | null;
  parentId: number | null;
  children?: Category[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("New Arrivals");
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterCategory, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let url = `${import.meta.env.VITE_API_URL}/products?page=${currentPage}&limit=12`;

        if (debouncedSearch) url += `&search=${debouncedSearch}`;
        if (filterCategory) url += `&category=${filterCategory}`;
        if (sortBy) url += `&sort=${sortBy}`;

        const res = await fetch(url);
        const json = await res.json();

        setProducts(json.data as ProductSummary[]);

        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, filterCategory, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearch("");
    setSortBy("New Arrivals");
    setFilterCategory(null);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    // Sửa 1: Giảm padding dọc tổng thể từ py-12 xuống py-8
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Sửa 2: Giảm margin-bottom từ mb-10 xuống mb-6 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Our Products
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Discover the latest trends and essential styles.
          </p>
        </div>

        {/* Sửa 3: Giảm khoảng cách dưới thanh search từ mb-10 xuống mb-8 */}
        <div className="mb-8 max-w-2xl mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="w-full p-3 pl-12 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <SideBar
            categories={categories}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            clearAllFilters={clearAllFilters}
          />

          <main className="flex-1 w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay message={error} onRetry={handleRetry} />
            ) : products.length > 0 ? (
              <div className="animate-fade-in-up">
                <ProductList products={products} />
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900">
                  No products found
                </p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
