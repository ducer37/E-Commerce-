import Hero from "../components/Hero";
import Hot from "../components/Hot";
import Featured from "../components/Featured";
import Merit from "../components/Merit";
import type { ProductSummary } from "../components/ProductCard";
import Contact from "../components/Contact";
import type { FormData } from "../App";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/variants/button";
import { SupportWidget } from "../components/SupportWidget";

// interface HomeProp {
//   cartItemCount: number;
// }

const HomePage = () => {
  const [products, setProduct] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [featuredTab, setFeaturedTab] = useState("Men Polos");
  const [whatsHotTab, setWhatsHotTab] = useState("new");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Tăng limit lên 20 để đủ data chia dòng
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products?limit=100`);
      if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm.");
      const data = await res.json();
      setProduct(data.data as ProductSummary[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // SỬA: Lấy 10 sản phẩm (5 cột x 2 dòng)
  const whatsHotProducts = products
    .filter((p: ProductSummary) => (p.sections || []).includes(whatsHotTab))
    .slice(0, 10);

  // SỬA: Lấy 10 sản phẩm
  const featuredProducts = products
    .filter((item) =>
      (item.category || []).some((cat) => cat.includes(featuredTab))
    )
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={fetchProducts}
          variant="default"
          className="bg-red-600"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans">
      <Hero />

      {/* SỬA: Giảm padding (py-8 thay vì pt-12 pb-24) để các khối sát nhau */}
      <section className="pt-0 pb-8 bg-white relative z-10 shadow-sm">
        <Hot
          whatsHotProducts={whatsHotProducts}
          whatsHotTab={whatsHotTab}
          setWhatsHotTab={setWhatsHotTab}
        />
      </section>

      {/* SỬA: Giảm padding */}
      <section className="py-8 bg-gray-50/50 border-t border-b border-gray-100">
        <Featured
          featuredTab={featuredTab}
          setFeaturedTab={setFeaturedTab}
          featuredProducts={featuredProducts}
        />
      </section>

      <Merit />

      <section className="bg-white relative z-10 py-8">
        <Contact
          handleSubmitContact={handleSubmitContact}
          formData={formData}
          setFormData={setFormData}
        />
      </section>

      <Footer />
      <SupportWidget />
    </div>
  );
};

export default HomePage;
