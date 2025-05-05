import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";

type CartItem = {
  id: string;
  price: number;
  name: string;
  attributes?: Array<{ attributeName: string; attributeValue: string }>;
  amount: number;
};

export default function Cart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );
  const itemCount = cart.reduce((sum, item) => sum + item.amount, 0);

  const updateQuantity = (index: number, newAmount: number) => {
    if (newAmount < 1) return;

    const updatedCart = [...cart];
    updatedCart[index] = { ...updatedCart[index], amount: newAmount };
    setCart(updatedCart);
  };

  const removeItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <ShoppingBag size={64} className="mb-4 text-gray-300" />
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Your cart is empty
          </h1>
          <p className="mb-8 text-gray-600">
            Looks like you haven't added anything to your cart yet.
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">
        Your Cart ({itemCount} items)
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4 text-right">Price</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <tr
                    key={`${item.id}-${JSON.stringify(item.attributes)}`}
                    className="py-4"
                  >
                    <td className="py-4">
                      <div className="flex flex-col">
                        <Link
                          to={`/products/${item.id}`}
                          className="font-medium text-gray-800 hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
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
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(index, item.amount - 1)}
                          className="rounded-md border border-gray-300 p-1 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center">{item.amount}</span>
                        <button
                          onClick={() => updateQuantity(index, item.amount + 1)}
                          className="rounded-md border border-gray-300 p-1 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
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
                    <td className="py-4 text-right">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="flex w-auto items-center text-indigo-600 hover:text-indigo-800"
            >
              <ChevronLeft size={16} className="mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
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
              <span className="font-medium">Calculated at checkout</span>
            </div>

            <div className="mb-4 flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/payment"
              className="block w-full rounded-md bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
