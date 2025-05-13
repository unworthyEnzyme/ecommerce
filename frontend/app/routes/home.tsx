import { ShoppingCart, Filter, X } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import { useState, useEffect } from "react";
import * as api from "~/api/client";
import type { Route } from "./+types/home";

type AttributeOption = {
  id: number;
  name: string;
  values: string[];
};

type FilterState = {
  priceRange?: { min: number; max: number };
  attributeFilters: Record<string, string[]>; // attributeName -> selected values
  categoryId?: number;
  subCategoryId?: number;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const variantData = await api.variants.getAll();
  const topCategories = await api.products.getTopCategories();

  return {
    variants: variantData.variants,
    attributeOptions: variantData.attributeOptions,
    topCategories,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    variants: initialVariants,
    attributeOptions: initialAttributeOptions,
    topCategories,
  } = loaderData;

  const [variants, setVariants] = useState(initialVariants);
  const [attributeOptions, setAttributeOptions] = useState<AttributeOption[]>(
    initialAttributeOptions,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    attributeFilters: {},
  });

  const [cart, setCart] = useLocalStorage<
    Array<{
      id: string;
      price: number;
      name: string;
      attributes?: Record<string, string>;
      amount: number;
    }>
  >("cart", []);

  useEffect(() => {
    async function applyFilters() {
      setIsLoading(true);
      try {
        // Construct filter parameters
        const params: any = {};

        if (filters.categoryId) {
          params.topCategoryId = filters.categoryId.toString();
        }

        if (filters.subCategoryId) {
          params.subCategoryId = filters.subCategoryId.toString();
        }

        if (filters.priceRange) {
          params.minPrice = filters.priceRange.min;
          params.maxPrice = filters.priceRange.max;
        }

        // Get filtered variants
        const result = await api.variants.filterVariants(params);
        setVariants(result.variants);
        setAttributeOptions(result.attributeOptions);
      } catch (error) {
        console.error("Error filtering variants:", error);
      } finally {
        setIsLoading(false);
      }
    }

    applyFilters();
  }, [filters]);

  const addToCart = (variant: any) => {
    const existingItemIndex = cart.findIndex((item) => item.id === variant.id);

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
          id: variant.id,
          name: variant.name,
          price: variant.price,
          attributes: variant.attributes.reduce(
            (acc: Record<string, string>, attr: any) => {
              acc[attr.attributeName] = attr.attributeValue;
              return acc;
            },
            {},
          ),
          amount: 1,
        },
      ]);
    }
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }));
  };

  const handleAttributeChange = (
    attributeName: string,
    value: string,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      const currentValues = prev.attributeFilters[attributeName] || [];

      const updatedValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return {
        ...prev,
        attributeFilters: {
          ...prev.attributeFilters,
          [attributeName]: updatedValues,
        },
      };
    });
  };

  const handleCategoryChange = (categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
    }));
  };

  const clearFilters = () => {
    setFilters({
      attributeFilters: {},
    });
  };

  const priceRanges = [
    { id: 1, name: "Under $50", min: 0, max: 50 },
    { id: 2, name: "$50 - $100", min: 50, max: 100 },
    { id: 3, name: "$100 - $200", min: 100, max: 200 },
    { id: 4, name: "Over $200", min: 200, max: 10000 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 md:hidden"
        >
          {showFilters ? (
            <X size={16} className="mr-2" />
          ) : (
            <Filter size={16} className="mr-2" />
          )}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar - hidden on mobile unless toggled */}
        <aside
          className={`w-full md:block md:w-64 ${showFilters ? "block" : "hidden"}`}
        >
          <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <h3 className="mb-2 font-medium text-gray-800">Categories</h3>
              <div className="space-y-2">
                {topCategories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={filters.categoryId === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <h3 className="mb-2 font-medium text-gray-800">Price</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={
                        filters.priceRange?.min === range.min &&
                        filters.priceRange?.max === range.max
                      }
                      onChange={() =>
                        handlePriceRangeChange(range.min, range.max)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {range.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic Attribute Filters */}
            {attributeOptions.map((option) => (
              <div
                key={option.id}
                className="mb-4 border-b border-gray-200 pb-4"
              >
                <h3 className="mb-2 font-medium text-gray-800">
                  {option.name}
                </h3>
                <div className="space-y-2">
                  {option.values.map((value) => (
                    <label
                      key={`${option.id}-${value}`}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={(
                          filters.attributeFilters[option.name] || []
                        ).includes(value)}
                        onChange={(e) =>
                          handleAttributeChange(
                            option.name,
                            value,
                            e.target.checked,
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Products Display */}
        <section className="flex-1">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : variants.length > 0 ? (
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
                        e.currentTarget.className =
                          "h-full w-full object-cover";
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

                    {/* Display variant attributes */}
                    <div className="mb-3">
                      {variant.attributes.map((attr, idx) => (
                        <span
                          key={idx}
                          className="mr-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          {attr.attributeName}: {attr.attributeValue}
                        </span>
                      ))}
                    </div>

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
                No products found
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your filters
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
