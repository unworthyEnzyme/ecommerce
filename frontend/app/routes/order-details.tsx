import { useLocalStorage } from "usehooks-ts";
import type { Route } from "./+types/order-details";
import { cn } from "../lib/utils";

type CartItem = {
  id: string;
  price: number;
  name: string;
  attributes?: Array<{ attributeName: string; attributeValue: string }>;
  amount: number;
};

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  };

export default function OrderDetails({ params }: Route.ComponentProps) {
  const [cart] = useLocalStorage<CartItem[]>("cart", []);
  // Mock status - in real app this would come from API
  const status: OrderStatus = "processing";
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );
  const itemCount = cart.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Order Details ({itemCount} items)
        </h1>
        <div
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
            statusConfig[status].className,
          )}
        >
          {statusConfig[status].label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <tr
                    key={`${item.id}-${JSON.stringify(item.attributes)}`}
                    className="py-4"
                  >
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                        {item.attributes && item.attributes.length > 0 && (
                          <span className="mt-1 text-xs text-gray-500">
                            {item.attributes
                              .map(
                                (attr) =>
                                  `${attr.attributeName}: ${attr.attributeValue}`,
                              )
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">{item.amount}</td>
                    <td className="py-4 text-right">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          ${(item.price * item.amount).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${item.price} each
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>

            <div className="mb-4 flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">
                ${(cartTotal * 0.1).toFixed(2)}
              </span>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  ${(cartTotal * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
