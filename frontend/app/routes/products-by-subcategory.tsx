import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/products-by-subcategory";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const subCategoryId = params.subcategoryId;
  const topCategoryId = params.topCategoryId;

  const { variants } = await api.variants.getAllByCategories(
    topCategoryId,
    subCategoryId,
  );

  return { variants };
}

export default function ProductsBySubcategory({
  loaderData,
}: Route.ComponentProps) {
  const { variants } = loaderData;

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
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        amount: (updatedCart[existingItemIndex].amount || 1) + 1,
      };
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          attributes: product.attributes,
          amount: 1,
        },
      ]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="flex-1">
        {variants.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg"
              >
                <div className="flex h-48 items-center justify-center overflow-hidden bg-gray-100">
                  <img
                    src={`https://localhost:7215/api${variant.images[0]?.imageUrl}`}
                    alt={variant.name}
                    className="h-full w-full object-contain object-center"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                      e.currentTarget.className = "h-full w-full object-cover";
                    }}
                  />
                </div>
                <div className="p-4">
                  <Link to={`/products/${variant.id}`}>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 transition hover:text-indigo-600">
                      {variant.name}
                    </h3>
                  </Link>
                  <p className="mb-2 font-bold text-indigo-600">
                    ${variant.price}
                  </p>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                    {variant.product.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {variant.product.topCategory.name}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(variant)}
                      className="mt-2 flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      <ShoppingCart size={16} className="mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-lg font-medium text-gray-500">
              No products found in this category
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
