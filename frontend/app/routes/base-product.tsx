import apiClient from "~/api/client";
import type { Route } from "./+types/base-product";
import { Link } from "react-router";

export async function clientLoader({ params }: Route.LoaderArgs) {
  type Product = {
    productId: number;
    productCode: string;
    name: string;
    description: string;
    topCategory: { id: number; name: string };
    subCategory: { id: number; name: string };
  };
  try {
    const { data } = await apiClient.get<Product>(`/product/${params.id}`);
    if (!data) {
      throw new Error("Product not found");
    }
    return { product: data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { product: null };
  }
}

export default function BaseProduct({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  if (!product) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/base-products"
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <Link to={`/products/${product.productId}/add-variant`}>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              Add Variant
            </button>
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{product.description}</p>
        </div>

        <div className="mb-4">
          <h2 className="mb-2 font-semibold text-gray-700">Categories</h2>
          <div className="flex space-x-2">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
              {product.topCategory.name}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
              {product.subCategory.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
