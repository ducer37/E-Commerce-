import { OrderSummary } from "../components/OrderSummary";
import { ShoppingBag, ArrowLeft, Ticket, Loader2 } from "lucide-react";
// Đảm bảo CartItemType trong App.tsx đã được update có đủ các trường: stock, productId, variantId
import type { CartItemType } from "../App";
import { useState, useEffect } from "react";
import { CartItem } from "../components/CartItem"; // Import component mới của bạn
import { Link, useNavigate } from "react-router";
import { Button } from "../components/variants/button";

interface CartProp {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
}

const CartPage = ({ cartItems, setCartItems }: CartProp) => {
  const navigate = useNavigate();

  // State UI
  const [shipping] = useState(15.0);
  const [discount, setDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper lấy token
  const getToken = () => localStorage.getItem("token");

  // 1. Fetch Cart từ Backend
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();

      // Nếu không có token -> Coi như giỏ hàng rỗng hoặc redirect login
      if (!token) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        // Lưu ý: Port 5000 (Backend)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // --- QUAN TRỌNG: Gửi Token ---
          },
        });

        if (response.status === 401 || response.status === 403) {
          // Token hết hạn -> Logout
          localStorage.removeItem("token");
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
          navigate("/signin");
          return;
        }

        const data = await response.json();

        // Backend trả về mảng khớp với CartItemProps, set thẳng vào state
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [setCartItems, navigate]);

  // 2. Xử lý thay đổi số lượng
  const handleQuantityChange = async (id: string, newQuantity: number) => {
    const token = getToken();
    if (!token) return;

    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    // Optimistic UI Update (Cập nhật giao diện trước khi gọi API cho mượt)
    const oldCart = [...cartItems];
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      // Nếu lỗi thì revert lại số cũ
      setCartItems(oldCart);
      alert("Không thể cập nhật số lượng (Có thể lỗi mạng hoặc hết hàng).");
    }
  };

  // 3. Xử lý xóa sản phẩm
  const handleRemoveItem = async (id: string) => {
    const token = getToken();
    if (!token) return;

    // Optimistic UI
    const oldCart = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      setCartItems(oldCart);
      alert("Không thể xóa sản phẩm.");
    }
  };

  // --- Logic hiển thị (Giữ nguyên code cũ của bạn) ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading Cart...
        </p>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const actualShipping = freeShipping ? 0 : shipping;

  // Coupon Logic (Tạm thời giữ ở Frontend)
  const possessedCodes = [
    { code: "SAVE10", description: "$10 off your order" },
    { code: "FASHION15", description: "$15 off your order" },
    { code: "FREESHIP", description: "Free shipping" },
  ];

  const handleApplyDiscount = (code: string) => {
    const discountCodes: {
      [key: string]: { type: "amount" | "freeship"; value: number };
    } = {
      SAVE10: { type: "amount", value: 10 },
      SAVE20: { type: "amount", value: 20 },
      FASHION15: { type: "amount", value: 15 },
      FREESHIP: { type: "freeship", value: 0 },
    };

    const discountData = discountCodes[code.toUpperCase()];
    if (discountData) {
      if (discountData.type === "freeship") {
        setFreeShipping(true);
        setDiscount(0);
      } else {
        setDiscount(discountData.value);
        setFreeShipping(false);
      }
      alert(`Applied code: ${code}`);
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-1">Review your selected items</p>
          </div>
          <Link
            to="/products"
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Product</span>
                <span className="font-semibold text-gray-700 hidden sm:block">
                  {cartItems.length} Items
                </span>
              </div>

              <div className="p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/products">
                      <Button className="bg-black text-white hover:bg-gray-800 px-8">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        {/* CartItem Mới: 
                            - Tự động nhận các props: id, productId, variantId, stock... từ item 
                            - onQuantityChange và onRemove đã được sửa để gọi API
                        */}
                        <CartItem
                          {...item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemoveItem}
                        />
                        {index !== cartItems.length - 1 && (
                          <div className="h-px bg-gray-100 my-6" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <OrderSummary
                subtotal={subtotal}
                shipping={actualShipping}
                discount={discount}
                onApplyDiscount={handleApplyDiscount}
              />
            </div>

            {cartItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ticket className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-900">Available Coupons</h3>
                </div>

                <div className="space-y-3">
                  {possessedCodes.map((code) => (
                    <div
                      key={code.code}
                      className="group relative flex flex-col sm:flex-row sm:items-center justify-between bg-indigo-50/50 border border-dashed border-indigo-200 p-3 rounded-lg hover:border-indigo-400 transition-colors cursor-pointer"
                      onClick={() => handleApplyDiscount(code.code)}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-indigo-700 font-mono tracking-wide">
                          {code.code}
                        </span>
                        <span className="text-xs text-indigo-600/80">
                          {code.description}
                        </span>
                      </div>

                      <div className="mt-2 sm:mt-0">
                        <button className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 text-gray-400 grayscale opacity-70">
              <p className="text-xs text-center">
                Secure Checkout • 30-Day Returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
