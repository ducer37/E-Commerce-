import { useState, useEffect } from "react";
import type { ProductSummary } from "./components/ProductCard";
import { Routes, Route, useNavigate } from "react-router";
import HomePage from "./pages/home";
import AboutPage from "./pages/about";
import Header from "./components/Header";
import SignInPage from "./pages/signin";
import RegisterPage from "./pages/register";
import ProductsPage from "./pages/products";
import CartPage from "./pages/cart";
import ProductDetail from "./components/ProductDetails";
import ContactPage from "./pages/contact";
import ProfilePage from "./pages/profile";
import OrderDetailPage from "./components/OrderDetailPage";

export interface CartItemType {
  id: string;
  productId: string;
  variantId: string;
  stock: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

export interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCart = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        // A. TRƯỜNG HỢP CÓ TOKEN (USER): Lấy từ API
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCartItems(data);
          }
        } catch (error) {
          console.error("Lỗi tải giỏ hàng từ server:", error);
        }
      } else {
        // B. TRƯỜNG HỢP KHÔNG TOKEN (GUEST): Lấy từ LocalStorage
        const localCart = localStorage.getItem("cart");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    };

    initializeCart();
  }, []); // Chạy 1 lần khi load trang

  const handleAddToCart = async (
    product: any,
    variant: any,
    quantity: number
  ) => {
    const token = localStorage.getItem("token");

    // === TRƯỜNG HỢP 1: KHÁCH VÃNG LAI (Lưu Local) ===
    if (!token) {
      setCartItems((prev) => {
        const variantIdStr = variant.id.toString();

        const isExist = prev.find((item) => item.variantId === variantIdStr);

        if (isExist) {
          // Cộng dồn số lượng
          return prev.map((item) => {
            if (item.variantId === variantIdStr) {
              const newQty = item.quantity + quantity;
              // Check stock client-side
              if (newQty > item.stock) {
                alert(`Kho chỉ còn ${item.stock} sản phẩm!`);
                return item;
              }
              return { ...item, quantity: newQty };
            }
            return item;
          });
        }

        // Tạo item mới
        const newItem: CartItemType = {
          id: `guest_${Date.now()}`,
          productId: product.id.toString(),
          variantId: variantIdStr,
          name: product.name,
          price: Number(product.price),
          image: variant.image || product.thumbnail || "",
          quantity: quantity,
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
        };

        return [...prev, newItem];
      });

      alert("Đã thêm vào giỏ hàng (Guest Mode)!");
      return;
    }

    // === TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP (Lưu Database) ===
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variantId: variant.id,
          quantity: quantity,
        }),
      });

      if (!res.ok) throw new Error("Lỗi thêm giỏ hàng");

      // Đồng bộ lại state từ Server để đảm bảo ID và dữ liệu chuẩn nhất
      const resCart = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newCartData = await resCart.json();
      setCartItems(newCartData);

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server!");
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header cartItemCount={cartItemCount} />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />

        {/* Truyền cartItems và setCartItems xuống CartPage để nó hiển thị */}
        <Route
          path="/cart"
          element={
            <CartPage cartItems={cartItems} setCartItems={setCartItems} />
          }
        />

        <Route
          path="/productdetail/:id"
          element={<ProductDetail onAddToCart={handleAddToCart} />}
        />
        <Route path="/orders/:id" element={<OrderDetailPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
