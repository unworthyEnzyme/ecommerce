import {
  ChevronDown,
  Edit,
  Globe,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  PlusCircle,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import * as api from "~/api/client";
import { LanguageProvider, useLanguage } from "../hooks/useLanguage";
import { If } from "~/lib/conditional";

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
        className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none"
      >
        {category.name}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-lg bg-white shadow-xl ring-1 ring-black">
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
  const { language, setLanguage, t } = useLanguage();
  const [topCategories, setTopCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const [cart, setCart] = useLocalStorage<
    Array<{
      id: string;
      price: number;
      name: string;
      attributes: Record<string, string>;
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

  useOnClickOutside(
    //@ts-ignore
    [dropdownRef, cartDropdownRef, mobileMenuRef, languageDropdownRef],
    () => {
      setDashboardOpen(false);
      setCartOpen(false);
      setMobileMenuOpen(false);
      setLanguageOpen(false);
    },
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.amount || 1),
    0,
  );

  return (
    <header className="mb-8 border-b border-gray-200 pb-4 shadow-sm">
      {/* Mobile menu button */}
      <div className="flex items-center justify-between py-3 lg:hidden">
        <Link to="/" className="flex items-center font-medium text-indigo-600">
          <Home size={20} className="mr-2" /> {t("home")}
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
            >
              <Globe size={20} />
            </button>
            {languageOpen && (
              <div className="ring-opacity-5 absolute right-0 z-20 mt-2 w-32 rounded-lg bg-white shadow-xl ring-1 ring-black">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLanguageOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      language === "en"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    } hover:bg-indigo-50 hover:text-indigo-600`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("tr");
                      setLanguageOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      language === "tr"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    } hover:bg-indigo-50 hover:text-indigo-600`}
                  >
                    Türkçe
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-[60px] right-0 left-0 z-20 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden"
        >
          <div className="flex flex-col space-y-4">
            {topCategories.map((category) => (
              <CategoryDropdown
                key={category.id}
                category={category}
                onLoadSubCategories={loadSubCategories}
                subCategories={subCategories[category.id]}
              />
            ))}
            <div className="mt-2 border-t border-gray-200 pt-4">
              {If(token !== null)
                .then(
                  <Link
                    to="/account"
                    className="flex items-center rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} className="mr-2" /> {t("account")}
                  </Link>,
                )
                .else(
                  <>
                    <Link
                      to="/login"
                      className="flex items-center rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn size={16} className="mr-2" /> {t("login")}
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus size={16} className="mr-2" /> {t("signup")}
                    </Link>
                  </>,
                )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <div className="hidden items-center justify-between py-2 lg:flex">
        {/* Categories with dropdowns */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="mr-2 flex items-center rounded-md px-3 py-2 font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800"
          >
            <Home size={18} className="mr-2" /> {t("home")}
          </Link>
          {topCategories.map((category) => (
            <CategoryDropdown
              key={category.id}
              category={category}
              onLoadSubCategories={loadSubCategories}
              subCategories={subCategories[category.id]}
            />
          ))}
        </div>

        {/* Login, Signup, Dashboard, Cart and Language Selector */}
        <div className="flex items-center space-x-2">
          {If(token !== null)
            .then(
              <Link
                to="/account"
                className="flex items-center rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} className="mr-2" /> {t("account")}
              </Link>,
            )
            .else(
              <>
                <Link
                  to="/login"
                  className="flex items-center rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={16} className="mr-2" /> {t("login")}
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus size={16} className="mr-2" /> {t("signup")}
                </Link>
              </>,
            )}

          {/* Language Selector */}
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                languageOpen
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              <Globe size={16} />
              <span className="ml-1">{language.toUpperCase()}</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${
                  languageOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {languageOpen && (
              <div className="ring-opacity-5 absolute right-0 z-10 mt-2 w-32 rounded-lg bg-white shadow-xl ring-1 ring-black">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLanguageOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      language === "en"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    } hover:bg-indigo-50 hover:text-indigo-600`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("tr");
                      setLanguageOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      language === "tr"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700"
                    } hover:bg-indigo-50 hover:text-indigo-600`}
                  >
                    Türkçe
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Dropdown */}
          <div className="relative" ref={cartDropdownRef}>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
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
              <span className="ml-1">{t("cart")}</span>
            </button>

            {cartOpen && (
              <div
                className="ring-opacity-5 absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black transition-all duration-200"
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                }}
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("yourCart")} ({cart.length}{" "}
                    {cart.length === 1 ? t("item") : t("items")})
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
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-indigo-600">
                            ${item.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("qty")}: {item.amount || 1}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      {t("cartEmpty")}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    <div className="border-t border-gray-100 px-4 py-3">
                      <div className="flex justify-between font-medium">
                        <span>{t("total")}:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2">
                      <Link
                        to="/cart"
                        className="block rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                        onClick={() => setCartOpen(false)}
                      >
                        {t("viewCart")}
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
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                dashboardOpen
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              <LayoutDashboard size={16} className="mr-1" />
              {t("dashboard")}
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform duration-200 ${dashboardOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dashboardOpen && (
              <div
                className="ring-opacity-5 absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black transition-all duration-200"
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                }}
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("adminDashboard")}
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
                      {t("addProduct")}
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
                      {t("createAttribute")}
                    </span>
                  </Link>

                  <div className="my-1 border-t border-gray-100"></div>

                  <Link
                    to="/suppliers"
                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50"
                    onClick={() => setDashboardOpen(false)}
                  >
                    <Truck
                      size={18}
                      className="mr-3 text-gray-400 group-hover:text-indigo-500"
                    />
                    <span className="group-hover:text-indigo-600">
                      {t("suppliers")}
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

export type Address = {
  userAddressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt?: string;
};

export type UserProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addresses: Address[];
};

export default function RootLayout() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await api.auth.getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <LanguageProvider>
      <div className="container mx-auto px-4 pt-6 pb-12">
        <Header />
        <Outlet context={{ profile, setProfile }} />
      </div>
    </LanguageProvider>
  );
}
