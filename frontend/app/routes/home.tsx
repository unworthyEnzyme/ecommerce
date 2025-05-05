import { ShoppingCart, Filter, X } from "lucide-react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import { useState, useEffect } from "react";
import * as api from "~/api/client";
import type { Route } from "./+types/home";

type FilterState = {
  priceRange?: { id: number; min: number; max: number };
  brands: string[];
  colors: string[];
  categoryId?: number;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const variants = await api.variants.getAll();
  const topCategories = await api.products.getTopCategories();
  const filterOptions = await api.products.getFilterOptions();

  return { variants, topCategories, filterOptions };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    variants: initialVariants,
    topCategories,
    filterOptions,
  } = loaderData;

  const [products, setProducts] = useState(initialVariants);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    colors: [],
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

  // TODO: Implement variant filtering
  /*
  useEffect(() => {
    async function applyFilters() {
      setIsLoading(true);
      try {
        const filteredProducts = await api.products.filterProducts({
          priceRange: filters.priceRange,
          brands: filters.brands.length > 0 ? filters.brands : undefined,
          colors: filters.colors.length > 0 ? filters.colors : undefined,
          categoryId: filters.categoryId,
        });
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    applyFilters();
  }, [filters]);
  */

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
          attributes: product.attributes,
          amount: 1,
        },
      ]);
    }
  };

  const handlePriceRangeChange = (rangeId: number) => {
    // TODO: Implement variant price filtering
    console.log("Price range filtering not implemented yet:", rangeId);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    // TODO: Implement variant brand filtering
    console.log("Brand filtering not implemented yet:", brand, checked);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    // TODO: Implement variant color filtering
    console.log("Color filtering not implemented yet:", color, checked);
  };

  const handleCategoryChange = (categoryId: number) => {
    // TODO: Implement variant category filtering
    console.log("Category filtering not implemented yet:", categoryId);
  };

  const clearFilters = () => {
    // TODO: Implement clear filters for variants
    console.log("Clear filters not implemented yet");
  };

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
                {filterOptions.priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={filters.priceRange?.id === range.id}
                      onChange={() => handlePriceRangeChange(range.id)}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {range.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <h3 className="mb-2 font-medium text-gray-800">Brand</h3>
              <div className="space-y-2">
                {filterOptions.brands.map((brand) => (
                  <label key={brand.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={filters.brands.includes(brand.name)}
                      onChange={(e) =>
                        handleBrandChange(brand.name, e.target.checked)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="mb-2 font-medium text-gray-800">Color</h3>
              <div className="space-y-2">
                {filterOptions.colors.map((color) => (
                  <label key={color.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={filters.colors.includes(color.name)}
                      onChange={(e) =>
                        handleColorChange(color.name, e.target.checked)
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {color.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Display */}
        <section className="flex-1">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((variant) => (
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
