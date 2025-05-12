import apiClient from "~/api/client";
import type { Route } from "./+types/base-products";
import { Link } from "react-router";

export async function clientLoader() {
  type Product = {
    productId: number;
    productCode: string;
    name: string;
    description: string;
    topCategory: { id: number; name: string };
    subCategory: { id: number; name: string };
  };
  try {
    const { data } = await apiClient.get<Product[]>("/product");
    console.log("Products data:", data);
    return { products: data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: null };
  }
}

export default function BaseProducts({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  if (!products) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        Error loading products
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Base Products</h1>
        <Link to="/products/add">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            Add Product
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.productId}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
          >
            <Link
              to={`/base-product/${product.productId}`}
              className="block h-full"
            >
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold text-gray-900 hover:text-indigo-600">
                  {product.name}
                </h2>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-800">
                      {product.topCategory.name}
                    </span>
                    {product.subCategory && (
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
                        {product.subCategory.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          <p>No products found. Add your first product to get started.</p>
        </div>
      )}
    </div>
  );
}
