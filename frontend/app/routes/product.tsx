import { Heart } from "lucide-react";
import { href, Link, useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/product";
import { useEffect, useState, useRef, use } from "react";
import { AxiosError } from "axios";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const data = await api.variants.getById(Number(params.id));
  if (!data) {
    throw new Response("Product not found", { status: 404 });
  }

  return data;
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { variant, attributeOptions } = loaderData;
  const navigate = useNavigate();
  const [_cart, setCart] = useLocalStorage("cart", [] as Array<{ id: string }>);
  const [favorites, setFavorites] = useState<
    Array<{
      id: number;
      variant: { id: number };
    }>
  >([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<number, string>
  >({});
  const isInitializingRef = useRef(false);

  useEffect(() => {
    // Initialize selected attributes with current variant's values
    if (attributeOptions && variant.attributes) {
      isInitializingRef.current = true;
      const initialSelections: Record<number, string> = {};

      // Map variant attributes to attribute options
      variant.attributes.forEach(({ attributeName, attributeValue }) => {
        // Find the corresponding attribute option by name
        const matchingOption = attributeOptions.find(
          (option) => option.name === attributeName,
        );
        if (matchingOption && matchingOption.values.includes(attributeValue)) {
          initialSelections[matchingOption.id] = attributeValue;
        }
      });

      setSelectedAttributes(initialSelections);
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 0);
    }

    // Fetch favorites
    const fetchFavorites = async () => {
      try {
        const data = await api.favorites.getAll();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };
    fetchFavorites();
  }, [variant, attributeOptions]);

  // Watch for attribute selection changes and redirect to the corresponding variant
  useEffect(() => {
    const fetchVariantByAttributes = async () => {
      if (
        Object.keys(selectedAttributes).length === 0 ||
        isInitializingRef.current
      ) {
        return;
      }

      try {
        const result = await api.variants.getVariantByAttributeOptions(
          variant.product.productId,
          selectedAttributes,
        );
        if (result && result.id !== variant.id) {
          navigate(`/products/${result.id}`);
        }
      } catch (error) {
        console.error("Failed to fetch variant by attributes:", error);
      }
    };

    fetchVariantByAttributes();
  }, [selectedAttributes, variant, navigate]);

  const addToCart = () => {
    setCart((prev) => [
      ...prev,
      {
        id: variant.id.toString(),
        price: variant.price,
        name: variant.name,
        attributes: variant.attributes,
        amount: 1,
      },
    ]);
  };

  const toggleFavorite = async () => {
    try {
      const existingFavorite = favorites.find(
        (f) => f.variant.id === variant.id,
      );
      if (existingFavorite) {
        await api.favorites.remove(existingFavorite.id);
        setFavorites(favorites.filter((f) => f.variant.id !== variant.id));
      } else {
        const result = await api.favorites.add(variant.id);
        setFavorites([...favorites, { id: result.id, variant }]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Failed to toggle favorite:", error);
        }
      }
      throw error;
    }
  };

  const isFavorite = favorites.some((item) => item.variant.id === variant.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={href("/")}
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Carousel */}
        <div className="relative h-96 overflow-hidden rounded-lg bg-gray-100 shadow-md">
          <div className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
            {variant.images.length > 0 ? (
              variant.images.map((image) => (
                <div
                  key={image.imageId}
                  className="h-full w-full flex-none snap-center"
                >
                  <img
                    src={`https://localhost:7215/api${image.imageUrl}`}
                    alt={`${variant.name} - Image ${image.imageId}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))
            ) : (
              <div className="flex h-full w-full flex-none snap-center items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {variant.name}
            </h1>
            <p className="mb-2 text-xl font-bold text-indigo-600">
              ${variant.price}
            </p>
            <p className="text-sm text-gray-500">Stock: {variant.stock}</p>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-gray-700">Categories</h2>
            <div className="flex space-x-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
                {variant.product.topCategory.name}
              </span>
              {variant.product.subCategory && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                  {variant.product.subCategory.name}
                </span>
              )}
            </div>
          </div>

          {/* Attribute Options */}
          {attributeOptions && attributeOptions.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 font-semibold text-gray-700">Options</h2>
              <div className="space-y-4">
                {attributeOptions.map((option) => (
                  <div key={option.id}>
                    <label className="mb-2 block font-medium text-gray-700">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={`${option.id}-${value}`}
                          className={`rounded-md border px-4 py-2 text-sm ${
                            selectedAttributes[option.id] === value
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [option.id]: value,
                            }));
                          }}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attributes */}
          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-gray-700">Specifications</h2>
            <div className="space-y-2">
              {variant.attributes.map((attr, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2 font-medium text-gray-700">
                    {attr.attributeName}:
                  </span>
                  <span className="text-gray-600">{attr.attributeValue}</span>
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
