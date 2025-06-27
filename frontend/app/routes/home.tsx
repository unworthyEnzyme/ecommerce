import { Filter, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/home";

type AttributeOption = {
  id: number;
  name: string;
  values: string[];
};

type FilterState = {
  priceRange?: { min: number; max: number };
  attributeFilters: Record<number, string[]>; // attributeId -> selected values
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

type ProductCardProps = {
  variant: api.Variant;
  onAddToCart: (variant: api.Variant) => void;
};

function ProductCard({ variant, onAddToCart }: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl">
      <div className="flex h-56 items-center justify-center overflow-hidden bg-gray-50">
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
      <div className="flex flex-grow flex-col p-5">
        <Link to={`/products/${variant.id}`} className="group">
          <h3 className="text-md mb-1 line-clamp-2 font-semibold text-gray-800 group-hover:text-indigo-600">
            {variant.name}
          </h3>
        </Link>
        <p className="my-1 text-xl font-bold text-indigo-600">
          ${variant.price}
        </p>
        <p className="mb-3 line-clamp-3 flex-grow text-xs text-gray-500">
          {variant.product.description}
        </p>

        {/* Display variant attributes */}
        <div className="mt-auto pt-3">
          <div className="mb-3 space-y-1 space-x-1">
            {variant.attributes.map((attr: any, idx: number) => (
              <span
                key={idx}
                className="mr-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
              >
                {attr.attributeName}: {attr.attributeValue}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{variant.product.topCategory.name}</span>
            {/* Potential stock status or other info here */}
          </div>
          <button
            onClick={() => onAddToCart(variant)}
            className="mt-3 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <ShoppingCart size={16} className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
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

  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");

  const [cart, setCart] = useLocalStorage<
    Array<{
      id: string;
      price: number;
      name: string;
      attributes?: Record<string, string>;
      amount: number;
    }>
  >("cart", []);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    async function applyFilters() {
      setIsLoading(true);
      try {
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

        // Add attribute filters if they exist
        if (Object.keys(filters.attributeFilters).length > 0) {
          params.attributeFilters = filters.attributeFilters;
        }

        const result = await api.variants.filterVariants(params);
        let processedVariants = result.variants;

        if (searchQuery) {
          processedVariants = processedVariants.filter((variant: any) =>
            variant.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        setVariants(processedVariants);
        setAttributeOptions(result.attributeOptions);
      } catch (error) {
        console.error("Error filtering variants:", error);
      } finally {
        setIsLoading(false);
      }
    }

    applyFilters();
  }, [filters, searchQuery]);

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

  const applyPriceRange = () => {
    const min = minPriceInput ? Number(minPriceInput) : 0;
    const max = maxPriceInput ? Number(maxPriceInput) : Number.MAX_SAFE_INTEGER;

    handlePriceRangeChange(min, max);
  };

  const handleAttributeChange = (
    attributeId: number,
    value: string,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      const currentValues = prev.attributeFilters[attributeId] || [];

      const updatedValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      return {
        ...prev,
        attributeFilters: {
          ...prev.attributeFilters,
          [attributeId]: updatedValues,
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
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  return (
    <div className="container mx-auto px-4 pt-2 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none md:hidden"
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
          className={`w-full md:block md:w-72 lg:w-80 ${showFilters ? "block" : "hidden"}`}
        >
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-5 border-b border-gray-200 pb-5">
              <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-600 uppercase">
                Categories
              </h3>
              <div className="space-y-2">
                {topCategories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center rounded-md p-1 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
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
            <div className="mb-5 border-b border-gray-200 pb-5">
              <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-600 uppercase">
                Price
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                  />
                </div>
                <button
                  onClick={applyPriceRange}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Apply
                </button>
                {filters.priceRange && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current: ${filters.priceRange.min}</span>
                    <span>to ${filters.priceRange.max}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Attribute Filters */}
            {attributeOptions.map((option) => (
              <div
                key={option.id}
                className="mb-5 border-b border-gray-200 pb-5 last:mb-0 last:border-b-0 last:pb-0"
              >
                <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-600 uppercase">
                  {option.name}
                </h3>
                <div className="space-y-2">
                  {option.values.map((value) => (
                    <label
                      key={`${option.id}-${value}`}
                      className="flex cursor-pointer items-center rounded-md p-1 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        checked={(
                          filters.attributeFilters[option.id] || []
                        ).includes(value)}
                        onChange={(e) =>
                          handleAttributeChange(
                            option.id,
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
            <div className="flex h-64 flex-col items-center justify-center text-gray-500">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-4 text-lg">Loading products...</p>
            </div>
          ) : variants.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {variants.map((variant) => (
                <ProductCard
                  key={variant.id}
                  variant={variant}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <Filter size={48} className="mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-600">
                No products found
              </p>
              <p className="mt-2 text-base text-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
