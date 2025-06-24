import { Filter, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/products-by-subcategory";

type AttributeOption = {
  id: number;
  name: string;
  values: string[];
};

type FilterState = {
  priceRange?: { min: number; max: number };
  attributeFilters: Record<number, string[]>;
};

export async function clientLoader({ params }: Route.LoaderArgs) {
  const subCategoryId = params.subcategoryId;
  const topCategoryId = params.topCategoryId;

  const { variants, attributeOptions } = await api.variants.getAllByCategories(
    topCategoryId,
    subCategoryId,
  );

  return { variants, attributeOptions };
}

export default function ProductsBySubcategory({
  loaderData,
  params,
}: Route.ComponentProps) {
  const {
    variants: initialVariants,
    attributeOptions: initialAttributeOptions,
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

  useEffect(() => {
    async function applyFilters() {
      setIsLoading(true);
      try {
        const parameters: Record<string, any> = {
          topCategoryId: params.topCategoryId,
          subCategoryId: params.subcategoryId,
        };

        if (filters.priceRange) {
          parameters.minPrice = filters.priceRange.min;
          parameters.maxPrice = filters.priceRange.max;
        }

        if (Object.keys(filters.attributeFilters).length > 0) {
          parameters.attributeFilters = filters.attributeFilters;
        }

        const result = await api.variants.filterVariants(parameters);
        setVariants(result.variants);
        setAttributeOptions(result.attributeOptions);
      } catch (error) {
        console.error("Error filtering variants:", error);
      } finally {
        setIsLoading(false);
      }
    }

    applyFilters();
  }, [filters, loaderData]);

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

  const clearFilters = () => {
    setFilters({
      attributeFilters: {},
    });
    setMinPriceInput("");
    setMaxPriceInput("");
  };

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
