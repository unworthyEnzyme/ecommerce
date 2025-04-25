import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ChevronLeft, CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";

type CartItem = {
  id: string;
  price: number;
  name: string;
  attributes?: Record<string, string>;
  amount: number;
};

type FormState = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

export default function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormState> = {};

    // Shipping information validation
    if (!formState.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formState.email.trim()) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formState.email))
      newErrors.email = "Invalid email format";
    if (!formState.address.trim()) newErrors.address = "Address is required";
    if (!formState.city.trim()) newErrors.city = "City is required";
    if (!formState.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!formState.country.trim()) newErrors.country = "Country is required";

    // Payment information validation
    if (!formState.cardName.trim())
      newErrors.cardName = "Name on card is required";
    if (!formState.cardNumber.trim())
      newErrors.cardNumber = "Card number is required";
    if (!/^\d{16}$/.test(formState.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Invalid card number";
    if (!formState.expiryDate.trim())
      newErrors.expiryDate = "Expiry date is required";
    if (!/^\d{2}\/\d{2}$/.test(formState.expiryDate))
      newErrors.expiryDate = "Invalid format (MM/YY)";
    if (!formState.cvv.trim()) newErrors.cvv = "CVV is required";
    if (!/^\d{3,4}$/.test(formState.cvv)) newErrors.cvv = "Invalid CVV";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCart([]);
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Your cart is empty
          </h1>
          <p className="mb-8 text-gray-600">
            You need items in your cart to proceed to payment.
          </p>
          <Link
            to="/cart"
            className="flex items-center rounded-md bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
          >
            <ChevronLeft size={16} className="mr-2" /> Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Payment Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <MapPin className="mr-2 text-indigo-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formState.address}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formState.city}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formState.postalCode}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formState.country}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <CreditCard className="mr-2 text-indigo-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="cardName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formState.cardName}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.cardName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formState.cardNumber}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formState.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formState.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className={`mt-1 w-full rounded-md border p-2 ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <ShieldCheck size={16} className="mr-2 text-green-500" />
                <span className="text-xs text-gray-500">
                  Your payment information is secured with SSL encryption
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/cart"
                className="mr-4 flex w-auto items-center text-indigo-600 hover:text-indigo-800"
              >
                <ChevronLeft size={16} className="mr-2" /> Return to Cart
              </Link>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="mb-4 max-h-96 overflow-auto">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${JSON.stringify(item.attributes)}`}
                  className="mb-3 border-b pb-3"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span>${(item.price * item.amount).toFixed(2)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm text-gray-500">
                    <span>Qty: {item.amount}</span>
                    <span>${item.price} each</span>
                  </div>
                  {item.attributes &&
                    Object.keys(item.attributes).length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        {Object.entries(item.attributes)
                          .filter(([_, value]) => value)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </div>
                    )}
                </div>
              ))}
            </div>

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
                ${(cartTotal * 0.07).toFixed(2)}
              </span>
            </div>

            <div className="mb-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  ${(cartTotal + cartTotal * 0.07).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full rounded-md bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
