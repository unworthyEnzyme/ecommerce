import { InputMask } from "@react-input/mask";
import {
  ChevronLeft,
  CreditCard,
  MapPin,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { href, Link, useNavigate, useOutletContext } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Address, UserProfile } from "./account.layout";

type AccountContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

type CartItem = {
  id: string;
  price: number;
  name: string;
  attributes?: Record<string, string>;
  amount: number;
};

type FormFields = {
  fullName: string;
  email: string;
  phoneNumber: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type FormErrors = Partial<FormFields> & { shippingAddress?: string };

export default function Payment() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<AccountContextType>();
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const [formState, setFormState] = useState<FormFields>({
    fullName: "",
    email: "",
    phoneNumber: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormState((prev) => ({
        ...prev,
        fullName:
          profile.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      }));

      if (
        profile.addresses &&
        profile.addresses.length > 0 &&
        !selectedAddressId
      ) {
        setSelectedAddressId(profile.addresses[0].userAddressId);
      } else if (
        (!profile.addresses || profile.addresses.length === 0) &&
        selectedAddressId
      ) {
        setSelectedAddressId(null); // Clear selection if addresses are removed
      }
    }
  }, [profile, selectedAddressId]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!formState.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formState.email))
      newErrors.email = "Invalid email format";
    if (!formState.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    if (profile && profile.addresses && profile.addresses.length > 0) {
      if (!selectedAddressId) {
        newErrors.shippingAddress = "Please select a shipping address.";
      }
    } else {
      newErrors.shippingAddress =
        "Please add a shipping address to your profile to continue.";
    }

    if (!formState.cardName.trim())
      newErrors.cardName = "Name on card is required";
    if (!formState.cardNumber.trim())
      newErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(formState.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Invalid card number (must be 16 digits)";
    if (!formState.expiryDate.trim())
      newErrors.expiryDate = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(formState.expiryDate))
      newErrors.expiryDate = "Invalid format (MM/YY)";
    if (!formState.cvv.trim()) newErrors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(formState.cvv))
      newErrors.cvv = "Invalid CVV (must be 3 or 4 digits)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      setErrors((prev) => ({
        ...prev,
        shippingAddress: "User profile not available. Please try reloading.",
      }));
      return;
    }
    if (!validateForm()) return;

    const selectedUserAddress = profile.addresses.find(
      (addr) => addr.userAddressId === selectedAddressId,
    );

    if (!selectedUserAddress) {
      setErrors((prev) => ({
        ...prev,
        shippingAddress: "Selected shipping address not found or invalid.",
      }));
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        fullName: formState.fullName,
        email: formState.email,
        address: selectedUserAddress.addressLine1,
        city: selectedUserAddress.city,
        postalCode: selectedUserAddress.postalCode,
        country: selectedUserAddress.country,
        phoneNumber: formState.phoneNumber, // Using phone number from form, prefilled from profile
        items: cart.map((item) => ({
          variantId: parseInt(item.id),
          quantity: item.amount,
        })),
      };

      const { orderId } = await api.orders.createOrder(orderData);
      setCart([]);
      navigate(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Order creation failed", error);
      setErrors((prev) => ({
        ...prev,
        shippingAddress: "Failed to create order. Please try again.",
      }));
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
            to={href("/cart")}
            className="flex items-center rounded-md bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
          >
            <ChevronLeft size={16} className="mr-2" /> Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-48 items-center justify-center">
          <p>Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
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
                    className={`mt-1 w-full rounded-md border p-2 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
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
                    className={`mt-1 w-full rounded-md border p-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <InputMask
                    mask="+90 ___ ___ __ __"
                    replacement={{ _: /\d/ }}
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formState.phoneNumber}
                    onChange={handleChange}
                    className={`mt-1 w-full rounded-md border p-2 ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md mb-2 font-semibold text-gray-700">
                  Select Shipping Address
                </h3>
                {profile.addresses && profile.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {profile.addresses.map((addr: Address) => (
                      <label
                        key={addr.userAddressId}
                        className={`flex cursor-pointer items-start rounded-md border p-3 transition-all ${
                          selectedAddressId === addr.userAddressId
                            ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={addr.userAddressId}
                          checked={selectedAddressId === addr.userAddressId}
                          onChange={() => {
                            setSelectedAddressId(addr.userAddressId);
                            if (errors.shippingAddress) {
                              setErrors((prev) => ({
                                ...prev,
                                shippingAddress: undefined,
                              }));
                            }
                          }}
                          className="mt-1 mr-3 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {addr.addressLine1}
                            {addr.addressLine2 && `, ${addr.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.city}, {addr.postalCode}, {addr.country}
                          </p>
                          <p className="text-sm text-gray-600">
                            Phone: {addr.phoneNumber}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                    <p className="text-sm text-gray-600">
                      No shipping addresses found in your profile.
                    </p>
                    <Link
                      to={href("/account/address/new")}
                      className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add New Address
                    </Link>
                  </div>
                )}
                {errors.shippingAddress && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.shippingAddress}
                  </p>
                )}
              </div>
            </div>

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
                    className={`mt-1 w-full rounded-md border p-2 ${errors.cardName ? "border-red-500" : "border-gray-300"}`}
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
                  <InputMask
                    mask="____ ____ ____ ____"
                    replacement={{ _: /\d/ }}
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formState.cardNumber}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    className={`mt-1 w-full rounded-md border p-2 ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
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
                  <InputMask
                    mask="__/__"
                    replacement={{ _: /\d/ }}
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formState.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className={`mt-1 w-full rounded-md border p-2 ${errors.expiryDate ? "border-red-500" : "border-gray-300"}`}
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
                  <InputMask
                    mask="___"
                    replacement={{ _: /\d/ }}
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formState.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className={`mt-1 w-full rounded-md border p-2 ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
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
                to={href("/cart")}
                className="mr-4 flex w-auto items-center text-indigo-600 hover:text-indigo-800"
              >
                <ChevronLeft size={16} className="mr-2" /> Return to Cart
              </Link>
            </div>
          </form>
        </div>

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
                    <span>${item.price.toFixed(2)} each</span>
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
              disabled={
                isProcessing ||
                !profile ||
                (profile.addresses.length === 0 && !selectedAddressId)
              }
              className="w-full rounded-md bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
