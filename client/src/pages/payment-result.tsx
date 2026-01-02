import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "../components/variants/button";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      // Get VNPay response code
      const vnpResponseCode = searchParams.get("vnp_ResponseCode");
      const vnpTxnRef = searchParams.get("vnp_TxnRef");

      // Check if payment was successful
      if (vnpResponseCode !== "00") {
        setStatus("failed");
        setMessage(
          vnpResponseCode === "24"
            ? "Payment cancelled by user"
            : `Payment failed with code: ${vnpResponseCode}`
        );
        // Clear pending checkout
        localStorage.removeItem("pendingCheckout");
        return;
      }

      // Payment successful - retrieve saved checkout info
      const pendingCheckoutStr = localStorage.getItem("pendingCheckout");
      
      if (!pendingCheckoutStr) {
        setStatus("failed");
        setMessage("No pending checkout found. Please try again.");
        return;
      }

      const pendingCheckout = JSON.parse(pendingCheckoutStr);
      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("failed");
        setMessage("Please login to complete your order");
        localStorage.removeItem("pendingCheckout");
        return;
      }

      // Create order (same as COD flow)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddressId: pendingCheckout.addressId,
            paymentMethod: "ONLINE", // VNPay
            vnpTxnRef: vnpTxnRef, // Optional: store VNPay transaction reference
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create order");
        }

        const orderData = await response.json();
        const createdOrderId = orderData.data?.id || orderData.id;

        // Success!
        setStatus("success");
        setMessage("Payment successful! Your order has been placed.");
        setOrderId(createdOrderId);

        // Clear localStorage
        localStorage.removeItem("pendingCheckout");
        localStorage.removeItem("cart"); // Clear guest cart if any
      } catch (error: any) {
        console.error("Order creation error:", error);
        setStatus("failed");
        setMessage(`Failed to create order: ${error.message}`);
        localStorage.removeItem("pendingCheckout");
      }
    };

    handlePaymentReturn();
  }, [searchParams]);

  const handleRedirect = () => {
    if (status === "success" && orderId) {
      navigate(`/orders/${orderId}`);
    } else {
      navigate("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {status === "loading" && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={handleRedirect}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              View Order
            </Button>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={handleRedirect}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Back to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;
