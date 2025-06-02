import { Heart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { href, Link } from "react-router";
import apiClient from "~/api/client";
import { type Variant } from "~/api/client";

type FavoriteItem = {
  id: string;
  variant: Variant;
};

type EmptyStateProps = {
  icon: React.FC<{ size: number; className: string }>;
  message: string;
  actionText: string;
};

const EmptyState = ({ icon: Icon, message, actionText }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Icon size={48} className="mb-4 text-gray-300" />
    <p className="text-gray-500">{message}</p>
    <Link
      to={href("/")}
      className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      {actionText}
    </Link>
  </div>
);

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient
        .get("/favorite", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFavorites(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch favorites:", error);
        });
    }
  }, []);

  const removeFavorite = async (id: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await apiClient.delete(`/favorite/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the item from the local state
        setFavorites(favorites.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Favorites</h2>
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          message="You haven't added any favorites yet."
          actionText="Browse Products"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <div className="h-48 overflow-hidden bg-gray-200">
                <img
                  src={`https://localhost:7215/api${item.variant.images[0].imageUrl}`}
                  alt={item.variant.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-medium text-gray-900">
                  {item.variant.name}
                </h3>
                <p className="mt-1 text-gray-600">
                  ${item.variant.price.toFixed(2)}
                </p>
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/products/${item.variant.id}`}
                    className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm text-white hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
