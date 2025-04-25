import { Heart, Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/product";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const product = await api.products.getProductById(params.id);
  return { product };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({
    Color:
      product.attributes.find((attr) => attr.type.name === "Color")?.value ||
      "",
    Size:
      product.attributes.find((attr) => attr.type.name === "Size")?.value || "",
    Material:
      product.attributes.find((attr) => attr.type.name === "Material")?.value ||
      "",
  });

  const handleOptionSelect = (attributeName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  type AttributeKey = "Color" | "Size" | "Material";

  const attributeOptions: Record<AttributeKey, string[]> = {
    Color: ["Red", "White", "Black"],
    Size: ["S", "M", "L", "XL"],
    Material: ["Cotton", "Polyester", "Wool"],
  };

  const hasAttributeOptions = (key: string): key is AttributeKey => {
    return Object.keys(attributeOptions).includes(key);
  };

  const [_cart, setCart] = useLocalStorage("cart", [] as Array<{ id: string }>);
  const [favorites, setFavorites] = useLocalStorage(
    "favorites",
    [] as string[],
  );

  const addToCart = () => {
    setCart((prev) => [
      ...prev,
      {
        id: product.id,
        price: product.price,
        name: product.name,
        attributes: selectedOptions,
        amount: 1,
      },
    ]);
  };

  const toggleFavorite = () => {
    setFavorites((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const isFavorite = favorites.includes(product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="flex h-96 items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-md">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x600?text=No+Image"
            }
            alt={product.name}
            className="h-full w-full object-contain object-center"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/600x600?text=No+Image";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mb-2 text-xl font-bold text-indigo-600">
              ${product.price}
            </p>
            <p className="text-sm text-gray-500">
              Product Code: {product.code}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-gray-700">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-gray-700">Categories</h2>
            <div className="flex space-x-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
                {product.topCategory.name}
              </span>
              {product.subCategory && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                  {product.subCategory.name}
                </span>
              )}
            </div>
          </div>

          {/* Attributes */}
          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-gray-700">Specifications</h2>
            <div className="space-y-4">
              {product.attributes &&
                product.attributes.map((attr) => (
                  <div key={attr.id} className="flex flex-col">
                    <div className="mb-2 flex items-center">
                      <Tag size={16} className="mr-2 text-gray-400" />
                      <span className="mr-2 font-medium text-gray-700">
                        {attr.type.name}:
                      </span>
                      <span className="text-gray-600">{attr.value}</span>
                    </div>

                    {/* Add attribute options if they exist in our sample data */}
                    {hasAttributeOptions(attr.type.name) && (
                      <div className="mt-1">
                        <div className="mb-1 text-sm text-gray-500">
                          Select {attr.type.name}:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {attributeOptions[attr.type.name].map(
                            (option: string) => (
                              <label key={option} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name={`attr-${attr.type.name}`}
                                  value={option}
                                  checked={
                                    selectedOptions[attr.type.name] === option
                                  }
                                  onChange={() =>
                                    handleOptionSelect(attr.type.name, option)
                                  }
                                  className="sr-only" // Hide the actual radio button
                                />
                                <div
                                  className={`rounded-md border px-4 py-2 text-sm transition-all ${
                                    selectedOptions[attr.type.name] === option
                                      ? "border-indigo-700 bg-indigo-600 text-white"
                                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  {option}
                                </div>
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Add to cart and favorite buttons */}
          <div className="mt-auto flex gap-2">
            <button
              className="focus:ring-opacity-50 flex-1 rounded-md bg-indigo-600 px-4 py-3 text-center text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              onClick={addToCart}
            >
              Add to Cart
            </button>
            <button
              className={`focus:ring-opacity-50 flex items-center justify-center rounded-md px-4 py-3 shadow-md focus:ring-2 focus:outline-none ${
                isFavorite
                  ? "bg-red-100 text-red-600 focus:ring-red-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500"
              }`}
              onClick={toggleFavorite}
              aria-label="Add to favorites"
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
