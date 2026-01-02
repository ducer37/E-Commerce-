import { Trash2, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./imagefallback";
import { Link } from "react-router";

export interface CartItemProps {
  id: string;
  productId: string;
  variantId: string;
  image: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  stock: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  productId,
  variantId,
  image,
  name,
  color,
  size,
  price,
  quantity,
  stock,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const total = price * quantity;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Ảnh: Click vào thì về trang chi tiết */}
      <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Link to={`/productdetail/${productId}`}>
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              {/* Tên: Click vào thì về trang chi tiết */}
              <Link
                to={`/productdetail/${productId}`}
                className="hover:underline"
              >
                <h3 className="font-medium text-gray-900">{name}</h3>
              </Link>
              <div className="mt-1 text-sm text-gray-500">
                <p>Color: {color}</p>
                <p>Size: {size}</p>
                {/* Hiển thị cảnh báo nếu sắp hết hàng */}
                {stock <= 5 && stock > 0 && (
                  <p className="text-orange-500 text-xs mt-1">
                    Chỉ còn {stock} sản phẩm
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onRemove(id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
            {/* Nút TRỪ */}
            <button
              onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-sm min-w-[20px] text-center">{quantity}</span>

            {/* Nút CỘNG: Logic chặn không cho tăng quá stock */}
            <button
              onClick={() => onQuantityChange(id, quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={quantity >= stock} // <--- Disable nếu chạm trần stock
              title={quantity >= stock ? "Đã đạt giới hạn kho" : "Thêm"}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
            <p className="font-medium text-gray-900">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
