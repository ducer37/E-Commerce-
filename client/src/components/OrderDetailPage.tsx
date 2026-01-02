import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../components/imagefallback";

// --- INTERFACES ---
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

interface OrderDetail {
  id: number;
  status: string;
  totalAmount: string;
  shippingFee: string;
  discountAmount: string;
  finalAmount: string;
  paymentMethod: string;
  paymentStatus: string | null;
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FETCH API ---
  useEffect(() => {
    const fetchOrderDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Order not found");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, navigate]);

  // --- HELPER RENDERS ---
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return {
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          icon: CheckCircle2,
          text: "Delivered",
        };
      case "SHIPPING":
        return {
          color: "text-blue-600 bg-blue-50 border-blue-200",
          icon: Truck,
          text: "Shipping",
        };
      case "PENDING":
        return {
          color: "text-amber-600 bg-amber-50 border-amber-200",
          icon: Clock,
          text: "Processing",
        };
      case "CANCELLED":
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          icon: XCircle,
          text: "Cancelled",
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50 border-gray-200",
          icon: Package,
          text: status,
        };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Hàm parse địa chỉ từ JSON string
  const renderAddress = (addressJson: string) => {
    try {
      // Giả sử DB lưu dạng JSON: { recipientName, phone, detail, city... }
      const addr = JSON.parse(addressJson);
      return (
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">{addr.recipientName}</p>
          <p>{addr.phone}</p>
          <p>{addr.detail}</p>
          <p>
            {addr.ward}, {addr.district}
          </p>
          <p>{addr.city}</p>
        </div>
      );
    } catch (e) {
      // Nếu không phải JSON mà là string thường
      return <p className="text-sm text-gray-600">{addressJson}</p>;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  if (error || !order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">
          Error: {error || "Order not found"}
        </p>
        <Link to="/profile" className="text-indigo-600 hover:underline">
          Back to Profile
        </Link>
      </div>
    );

  const statusInfo = getStatusConfig(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER: Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile"
            className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>#{order.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />{" "}
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          <div
            className={`ml-auto px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-medium ${statusInfo.color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {statusInfo.text}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">
                  Items ({order.orderItems.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
                      <ImageWithFallback
                        src={
                          item.variant.image ||
                          item.variant.product.thumbnail ||
                          ""
                        }
                        alt={item.variant.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {item.variant.product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Size: {item.variant.size} • Color:{" "}
                            {item.variant.color}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT METHOD (Mobile View could be here, but let's put in right column for Desktop) */}
          </div>

          {/* RIGHT COLUMN: Info & Summary */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  Shipping Address
                </h3>
              </div>
              {renderAddress(order.shippingAddress)}
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Payment</h3>
              </div>
              <div className="text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === "PAID"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {order.paymentStatus || "Unpaid"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${Number(order.shippingFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${Number(order.discountAmount).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">
                    Total
                  </span>
                  <span className="font-bold text-gray-900 text-xl">
                    ${Number(order.finalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
