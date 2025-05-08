import { useSearchParams } from "react-router";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Link } from "react-router";

export default function OrderConfirmation() {
  let [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center">
        <CheckCircle2 size={64} className="mb-4 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Order Confirmed!
        </h1>
        <p className="mb-4 text-center text-gray-600">
          Thank you for your purchase. Your order number is: {orderId}
        </p>
        <Link
          to={`/order/${orderId}`}
          className="mb-8 inline-flex items-center rounded-md bg-white px-4 py-2 text-indigo-600 ring-1 ring-indigo-600 transition-all ring-inset hover:bg-indigo-600 hover:text-white"
        >
          View Order Details
        </Link>
        <p className="mb-8 text-center text-gray-600">
          We'll send you a confirmation email with your order details and
          tracking information once your package ships.
        </p>
        <Link
          to="/"
          className="flex items-center rounded-md bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
        >
          <ChevronLeft size={16} className="mr-2" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
