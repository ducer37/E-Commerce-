import { Button } from "./variants/button";
import { ImageWithFallback } from "./imagefallback";
import { Badge } from "./variants/Badge";
import { Eye } from "lucide-react";
import { Link } from "react-router";

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string[];
  sections?: string[];
  color: string;
  size: string;
}

interface ProductCardProps {
  product: ProductSummary;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    // SỬA: Giảm shadow mặc định, chỉ shadow mạnh khi hover
    <div className="group relative bg-white rounded-md border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Ảnh sản phẩm */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges: Làm nhỏ lại */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.sections?.includes("new") && (
            <Badge className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              NEW
            </Badge>
          )}
          {product.sections?.includes("sale") && discount > 0 && (
            <Badge className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Nút View Detail: Hiện khi hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={`/productdetail/${product.id}`} className="w-full">
            <Button className="w-full bg-white/90 hover:bg-black hover:text-white text-black font-medium text-xs py-2 shadow-sm backdrop-blur-sm transition-colors">
              <Eye className="h-3 w-3 mr-1.5" />
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      {/* Thông tin sản phẩm: Giảm padding và font size */}
      <div className="p-3">
        <Link to={`/productdetail/${product.id}`} className="block">
          {/* SỬA: text-sm thay vì text-lg */}
          <h3 className="text-sm font-medium text-gray-700 truncate hover:text-black transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1">
          {/* SỬA: text-base thay vì text-xl */}
          <p className="font-bold text-base text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
