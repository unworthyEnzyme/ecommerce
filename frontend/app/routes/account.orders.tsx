import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import apiClient from "~/api/client";

type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
};

type EmptyStateProps = {
  icon: React.FC<{ size: number; className: string }>;
  message: string;
  actionText: string;
};

const EmptyState = ({ icon: Icon, message, actionText }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Icon size={48} className="mb-4 text-gray-300" />
    <p className="text-gray-500">{message}</p>
    <Link
      to="/"
      className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      {actionText}
    </Link>
  </div>
);

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await apiClient.get("/order", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(response.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          setError("Failed to load your orders. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Order History
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          message="You haven't placed any orders yet."
          actionText="Start Shopping"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-md border border-gray-200 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status.toLowerCase() === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status.toLowerCase() === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="mb-1 font-medium">Items:</p>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.productName} (x{item.quantity})
                    </span>
                    <span>${item.unitPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
                <span className="font-medium">Total</span>
                <span className="font-medium">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
