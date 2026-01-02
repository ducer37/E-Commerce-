import { useEffect, useState } from "react";
import {
  Package,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  Loader2,
  XCircle,
} from "lucide-react";
import { ImageWithFallback } from "./imagefallback";
import { Link } from "react-router";

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  variant: {
    size: string;
    color: string;
    image: string | null;
    product: {
      name: string;
      thumbnail: string | null;
    };
  };
}

interface Order {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
      case "COMPLETED":
        return {
          style: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "SHIPPING":
      case "SHIPPED":
        return {
          style: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Truck,
          dot: "bg-blue-500",
        };
      case "PENDING":
      case "PROCESSING":
        return {
          style: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Clock,
          dot: "bg-amber-500",
        };
      case "CANCELLED":
        return {
          style: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          dot: "bg-red-500",
        };
      default:
        return {
          style: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Package,
          dot: "bg-gray-500",
        };
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="text-gray-500 mt-1">
          Start shopping to create your first order!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Order History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Check the status of recent orders.
          </p>
        </div>
        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status);

          return (
            <div
              key={order.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300"
            >
              {/* HEADER ĐƠN HÀNG */}
              <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.style}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                        />
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* NÚT VIEW DETAILS -> Chuyển hướng sang trang chi tiết */}
                <Link
                  to={`/orders/${order.id}`}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:translate-x-1 duration-300"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* LIST SẢN PHẨM TRONG ĐƠN (Hiển thị tóm tắt) */}
              <div className="p-6">
                <div className="space-y-6">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start sm:items-center gap-4"
                    >
                      <div className="relative group/image">
                        <ImageWithFallback
                          // Ưu tiên ảnh variant, nếu không có lấy ảnh sản phẩm gốc
                          src={
                            item.variant.image ||
                            item.variant.product.thumbnail ||
                            ""
                          }
                          alt={item.variant.product.name}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.variant.product.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            Size: {item.variant.size} | Color:{" "}
                            {item.variant.color}
                          </span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
