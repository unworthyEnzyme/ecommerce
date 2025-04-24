import { Link } from "react-router";
import type { Route } from "./+types/home";
import * as api from "~/api/client";
import { useState, useRef, useEffect } from "react";
import {
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Edit,
  Tag,
  Settings,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const products = await api.products.getProducts();
  const topCategories = await api.products.getTopCategories();

  return { products, topCategories };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products, topCategories } = loaderData;
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDashboardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          {/* Categories */}
          <div className="flex space-x-6">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="text-gray-700 hover:text-indigo-600 hover:underline"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Login, Signup, and Dashboard */}
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

      {/* Products Display */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="flex h-48 items-center justify-center overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain object-center"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                    e.currentTarget.className = "h-full w-full object-cover";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mb-2 font-bold text-indigo-600">
                  ${product.price}
                </p>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {product.topCategory.name}
                  </span>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
