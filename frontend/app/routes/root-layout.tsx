import {
  ChevronDown,
  Edit,
  LayoutDashboard,
  LogIn,
  PlusCircle,
  Settings,
  ShoppingCart,
  Tag,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import * as api from "~/api/client";

type CategoryDropdownProps = {
  category: { id: number; name: string };
  onLoadSubCategories: (categoryId: number) => Promise<void>;
  subCategories: Array<{ id: number; name: string }> | undefined;
};

function CategoryDropdown({
  category,
  onLoadSubCategories,
  subCategories,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      onLoadSubCategories(category.id);
    }
  };
  //@ts-ignore
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center text-gray-700 hover:text-indigo-600 hover:underline focus:outline-none"
      >
        {category.name}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black">
          <div className="py-1">
            {subCategories ? (
              subCategories.length > 0 ? (
                subCategories.map((subCategory) => (
                  <Link
                    key={subCategory.id}
                    to={`/categories/${category.id}/subcategories/${subCategory.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {subCategory.name}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No subcategories
                </div>
              )
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Header() {
  const [topCategories, setTopCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  const [cart, setCart] = useLocalStorage<
    Array<{
      id: string;
      price: number;
      name: string;
      attributes?: Record<string, string>;
      amount: number;
    }>
  >("cart", []);

  const [subCategories, setSubCategories] = useState<
    Record<number, Array<{ id: number; name: string }>>
  >({});

  const loadSubCategories = async (categoryId: number) => {
    if (!subCategories[categoryId]) {
      try {
        const categories = await api.products.getSubCategories(categoryId);
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: categories,
        }));
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    }
  };

  useEffect(() => {
    async function loadTopCategories() {
      try {
        const categories = await api.products.getTopCategories();
        setTopCategories(categories);
      } catch (error) {
        console.error("Failed to fetch top categories:", error);
      }
    }

    loadTopCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDashboardOpen(false);
      }

      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.amount || 1),
    0,
  );

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        {/* Categories with dropdowns */}
        <div className="flex space-x-6">
          {topCategories.map((category) => (
            <CategoryDropdown
              key={category.id}
              category={category}
              onLoadSubCategories={loadSubCategories}
              subCategories={subCategories[category.id]}
            />
          ))}
        </div>

        {/* Login, Signup, Dashboard and Cart */}
        <div className="flex items-center space-x-6">
          <Link
            to="/login"
            className="flex items-center text-gray-700 hover:text-indigo-600 hover:underline"
          >
            <LogIn size={16} className="mr-2" /> Login
          </Link>
          <Link
            to="/signup"
            className="flex items-center text-gray-700 hover:text-indigo-600 hover:underline"
          >
            <UserPlus size={16} className="mr-2" /> Sign Up
          </Link>

          {/* Cart Dropdown */}
          <div className="relative" ref={cartDropdownRef}>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className={`flex items-center gap-1 rounded-md px-3 py-2 transition-all duration-200 ${
                cartOpen
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              <div className="relative">
                <ShoppingCart size={16} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="ml-1">Cart</span>
            </button>

            {cartOpen && (
              <div
                className="ring-opacity-5 absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black transition-all duration-200"
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                }}
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Your Cart ({cart.length}{" "}
                    {cart.length === 1 ? "item" : "items"})
                  </h3>
                </div>

                <div className="max-h-80 overflow-y-auto py-1">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <Link
                        key={item.id + JSON.stringify(item.attributes)}
                        to={`/products/${item.id}`}
                        className="group flex items-center border-b border-gray-100 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setCartOpen(false)}
                      >
                        <div className="flex-1">
                          <p className="font-medium group-hover:text-indigo-600">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.attributes &&
                              Object.entries(item.attributes)
                                .filter(([_, value]) => value) // Filter out empty attributes
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-indigo-600">
                            ${item.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.amount || 1}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      Your cart is empty
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 px-4 py-3">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2">
                      <Link
                        to="/cart"
                        className="block rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                        onClick={() => setCartOpen(false)}
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Dashboard Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDashboardOpen(!dashboardOpen)}
              className={`flex items-center gap-1 rounded-md px-3 py-2 transition-all duration-200 ${
                dashboardOpen
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              <LayoutDashboard size={16} className="mr-1" />
              Dashboard
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${dashboardOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dashboardOpen && (
              <div
                className="ring-opacity-5 absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black transition-all duration-200"
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                }}
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Admin Dashboard
                  </h3>
                </div>

                <div className="py-1">
                  <Link
                    to="/products/add"
                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDashboardOpen(false)}
                  >
                    <PlusCircle
                      size={18}
                      className="mr-3 text-gray-400 group-hover:text-indigo-500"
                    />
                    <span className="group-hover:text-indigo-600">
                      Add Product
                    </span>
                  </Link>

                  <Link
                    to="/products/create-attribute-type"
                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDashboardOpen(false)}
                  >
                    <Tag
                      size={18}
                      className="mr-3 text-gray-400 group-hover:text-indigo-500"
                    />
                    <span className="group-hover:text-indigo-600">
                      Create Attribute
                    </span>
                  </Link>

                  <div className="my-1 border-t border-gray-100"></div>

                  <Link
                    to="/products/1/add-attribute"
                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDashboardOpen(false)}
                  >
                    <Settings
                      size={18}
                      className="mr-3 text-gray-400 group-hover:text-indigo-500"
                    />
                    <span className="group-hover:text-indigo-600">
                      Add Attribute
                    </span>
                  </Link>

                  <Link
                    to="/products/1/edit"
                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDashboardOpen(false)}
                  >
                    <Edit
                      size={18}
                      className="mr-3 text-gray-400 group-hover:text-indigo-500"
                    />
                    <span className="group-hover:text-indigo-600">
                      Edit Product
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <Outlet />
    </div>
  );
}
