import { useEffect, useState } from "react";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { ImageWithFallback } from "./imagefallback";
import { ProductReviews } from "./ProductReviews";
import { useParams } from "react-router";
import type { ProductSummary } from "./ProductCard";

interface ProductVariant {
  id: string;
  color: string;
  colorCode: string;
  size: string;
  stock: number;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  variants: ProductVariant[];
}

interface ProductDetailProp {
  onAddToCart: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;
}

const ProductDetail = ({ onAddToCart }: ProductDetailProp) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);

        if (!res.ok) throw new Error("Product not found");

        const response = await res.json();
        const data = response.data as Product;
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          const firstInStock = data.variants.find((v) => v.stock > 0);
          setSelectedVariant(firstInStock || data.variants[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newVal = prev + delta;
      if (newVal < 1) return 1;
      // Chặn không cho chọn quá số lượng tồn kho
      if (selectedVariant && newVal > selectedVariant.stock)
        return selectedVariant.stock;
      return newVal;
    });
  };

  const handleAddToCartClick = () => {
    if (product && selectedVariant) {
      if (selectedVariant.stock === 0) {
        alert("Sản phẩm này tạm hết hàng!");
        return;
      }
      // Gọi hàm từ App.tsx
      onAddToCart(product, selectedVariant, quantity);
    }
  };

  const handleColorSelect = (colorName: string) => {
    if (!product) return;
    // Tìm variant cùng màu, ưu tiên giữ nguyên size đang chọn
    const variantOfColor =
      product.variants.find(
        (v) => v.color === colorName && v.size === selectedVariant?.size
      ) || product.variants.find((v) => v.color === colorName);

    if (variantOfColor) {
      setSelectedVariant(variantOfColor);
      setQuantity(1); // Reset số lượng khi đổi biến thể
    }
  };

  const handleSizeSelect = (sizeVariant: ProductVariant) => {
    setSelectedVariant(sizeVariant);
    setQuantity(1);
  };

  if (loading)
    return <div className="p-10 text-center">Loading product...</div>;
  if (error || !product || !selectedVariant)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  const uniqueColorVariants = [
    ...new Map(product.variants.map((item) => [item.color, item])).values(),
  ];

  const availableSizes = product.variants.filter(
    (p) => p.color === selectedVariant.color
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : star - 0.5 <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
              <ImageWithFallback
                src={selectedVariant.image || "https://via.placeholder.com/500"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay khi hết hàng */}
              {selectedVariant.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-2xl uppercase border-4 border-white px-6 py-2">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  {renderStars(product.rating)}
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* CHỌN MÀU */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Color:{" "}
                  <span className="text-gray-500 font-normal">
                    {selectedVariant.color}
                  </span>
                </label>
                <div className="flex gap-3">
                  {uniqueColorVariants.map((colorVar) => (
                    <button
                      key={colorVar.id}
                      onClick={() => handleColorSelect(colorVar.color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedVariant.color === colorVar.color
                          ? "border-blue-600 scale-110 ring-2 ring-blue-100"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      aria-label={colorVar.color}
                    >
                      <div
                        className="w-full h-full rounded-full border border-gray-100"
                        style={{ backgroundColor: colorVar.colorCode }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* CHỌN SIZE */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Size:{" "}
                  <span className="text-gray-500 font-normal">
                    {selectedVariant.size}
                  </span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {availableSizes.map((sizeVar) => (
                    <button
                      key={sizeVar.id}
                      onClick={() => handleSizeSelect(sizeVar)}
                      disabled={sizeVar.stock === 0}
                      className={`py-3 px-2 border rounded-lg transition-all text-sm font-medium relative ${
                        selectedVariant.id === sizeVar.id
                          ? "border-blue-600 bg-blue-600 text-white shadow-md"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      } ${
                        sizeVar.stock === 0
                          ? "opacity-40 cursor-not-allowed bg-gray-50"
                          : ""
                      }`}
                    >
                      {sizeVar.size}
                      {sizeVar.stock === 0 && (
                        <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHỌN SỐ LƯỢNG & NÚT MUA */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {/* Bộ chọn số lượng */}
                <div className="flex items-center border border-gray-300 rounded-lg w-fit bg-white h-12">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 h-full hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1 || selectedVariant.stock === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 h-full hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                    disabled={
                      quantity >= selectedVariant.stock ||
                      selectedVariant.stock === 0
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Nút Add to Cart */}
                <button
                  onClick={handleAddToCartClick}
                  disabled={selectedVariant.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg font-bold text-lg transition-all shadow-md active:scale-[0.98] ${
                    selectedVariant.stock > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {selectedVariant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>

              {/* Cảnh báo tồn kho thấp */}
              {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                <p className="text-sm text-orange-600 font-medium animate-pulse">
                  🔥 Chỉ còn {selectedVariant.stock} sản phẩm trong kho!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ProductReviews />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
