import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/home";

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
  const { products } = loaderData;

  const [cart, setCart] = useLocalStorage<
    Array<{
      id: string;
      price: number;
      name: string;
      attributes?: Record<string, string>;
      amount: number;
    }>
  >("cart", []);

  const addToCart = (product: any) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      // Product already in cart, increase amount
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        amount: (updatedCart[existingItemIndex].amount || 1) + 1,
      };
      setCart(updatedCart);
    } else {
      // Product not in cart, add it
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          amount: 1,
        },
      ]);
    }
  };

  return (
    <div>
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
                <Link to={`/products/${product.id}`}>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 transition hover:text-indigo-600">
                    {product.name}
                  </h3>
                </Link>
                <p className="mb-2 font-bold text-indigo-600">
                  ${product.price}
                </p>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {product.description}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {product.topCategory.name}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-2 flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    <ShoppingCart size={16} className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
