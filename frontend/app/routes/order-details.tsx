import apiClient from "~/api/client";
import { cn } from "../lib/utils";
import type { Route } from "./+types/order-details";

interface OrderVariantAttribute {
  attributeName: string;
  attributeValue: string;
}

interface OrderItem {
  variantId: number;
  productId: number;
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  attributes: OrderVariantAttribute[];
}

interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
}

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

export async function clientLoader({ params: { id } }: Route.ClientLoaderArgs) {
  try {
    const response = await apiClient.get<Order>(`/order/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { order: response.data };
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return { order: null, error: "Failed to load order details" };
  }
}

export default function OrderDetails({
  loaderData: { order },
}: Route.ComponentProps) {
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800">Order not found</h1>
      </div>
    );
  }

  const status = order.status.toLowerCase() as OrderStatus;
  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const subtotal = order.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const taxAmount = order.totalAmount - subtotal; // Assuming totalAmount includes tax

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
                {order.items.map((item) => (
                  <tr
                    key={`${item.variantId}-${item.productId}`}
                    className="py-4"
                  >
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {item.productName}
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
                    <td className="py-4">{item.quantity}</td>
                    <td className="py-4 text-right">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${item.unitPrice.toFixed(2)} each
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
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>

            <div className="mb-4 flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
