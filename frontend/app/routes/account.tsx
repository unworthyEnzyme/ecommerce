import {
  Edit,
  Heart,
  LogOut,
  Package,
  Save,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import apiClient from "~/api/client";
import { type Variant } from "~/api/client";

type FavoriteItem = {
  id: string;
  variant: Variant;
};

type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
};

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type SidebarProps = {
  activeTab: "profile" | "orders" | "favorites";
  setActiveTab: (tab: "profile" | "orders" | "favorites") => void;
  profile: UserProfile;
};

const Sidebar = ({ activeTab, setActiveTab, profile }: SidebarProps) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <div className="mb-6 flex items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
        <User className="text-indigo-600" size={24} />
      </div>
      <div className="ml-4">
        <p className="font-medium text-gray-800">{profile.name}</p>
        <p className="text-sm text-gray-500">{profile.email}</p>
      </div>
    </div>

    <nav className="space-y-2">
      {[
        { id: "profile", icon: User, label: "Profile" },
        { id: "orders", icon: Package, label: "Order History" },
        { id: "favorites", icon: Heart, label: "Favorites" },
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id as typeof activeTab)}
          className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
            activeTab === id
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Icon size={18} className="mr-3" />
          <span>{label}</span>
        </button>
      ))}

      <Link
        to="/cart"
        className="flex w-full items-center rounded-md px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
      >
        <ShoppingBag size={18} className="mr-3" />
        <span>Cart</span>
      </Link>

      <hr className="my-2 border-gray-200" />

      <button className="flex w-full items-center rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50">
        <LogOut size={18} className="mr-3" />
        <span>Sign Out</span>
      </button>
    </nav>
  </div>
);

type ProfileFormProps = {
  profile: UserProfile;
  isEditing: boolean;
  editableProfile: UserProfile;
  setIsEditing: (value: boolean) => void;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveProfile: () => void;
  cancelEditing: () => void;
};

const ProfileForm = ({
  profile,
  isEditing,
  editableProfile,
  setIsEditing,
  handleProfileChange,
  saveProfile,
  cancelEditing,
}: ProfileFormProps) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">
        Profile Information
      </h2>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <Edit size={16} className="mr-2" /> Edit
        </button>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={saveProfile}
            className="flex items-center text-green-600 hover:text-green-800"
          >
            <Save size={16} className="mr-2" /> Save
          </button>
          <button
            onClick={cancelEditing}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <X size={16} className="mr-2" /> Cancel
          </button>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Object.entries(profile).map(([key, value]) => (
        <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
          <label className="block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          {isEditing ? (
            <input
              type={
                key === "email" ? "email" : key === "phone" ? "tel" : "text"
              }
              name={key}
              value={editableProfile[key as keyof UserProfile]}
              onChange={handleProfileChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          ) : (
            <p className="mt-1 text-gray-900">{value}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const OrdersList = ({
  orders,
  isLoading,
  error,
}: {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <h2 className="mb-6 text-xl font-semibold text-gray-800">Order History</h2>

    {isLoading ? (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    ) : error ? (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    ) : orders.length === 0 ? (
      <EmptyState
        icon={Package}
        message="You haven't placed any orders yet."
        actionText="Start Shopping"
      />
    ) : (
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="rounded-md border border-gray-200 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.status.toLowerCase() === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status.toLowerCase() === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <p className="mb-1 font-medium">Items:</p>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.productName} (x{item.quantity})
                  </span>
                  <span>${item.unitPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
              <span className="font-medium">Total</span>
              <span className="font-medium">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const FavoritesList = ({ favorites }: { favorites: FavoriteItem[] }) => (
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
                  to={`/products/${item.id}`}
                  className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-center text-sm text-white hover:bg-indigo-700"
                >
                  View Details
                </Link>
                <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50">
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
      to="/"
      className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      {actionText}
    </Link>
  </div>
);

export default function Account() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "favorites"
  >("profile");
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useLocalStorage<UserProfile>("userProfile", {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+90 123 123 12 12",
    address: "123 Main St.",
    city: "Istanbul",
    postalCode: "34000",
    country: "Turkey",
  });
  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (activeTab === "orders" && token) {
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await apiClient.get("/order", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(response.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          setError("Failed to load your orders. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [activeTab]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    setProfile(editableProfile);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditableProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">My Account</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            profile={profile}
          />
        </div>
        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <ProfileForm
              profile={profile}
              isEditing={isEditing}
              editableProfile={editableProfile}
              setIsEditing={setIsEditing}
              handleProfileChange={handleProfileChange}
              saveProfile={saveProfile}
              cancelEditing={cancelEditing}
            />
          )}
          {activeTab === "orders" && (
            <OrdersList orders={orders} isLoading={isLoading} error={error} />
          )}
          {activeTab === "favorites" && <FavoritesList favorites={favorites} />}
        </div>
      </div>
    </div>
  );
}
