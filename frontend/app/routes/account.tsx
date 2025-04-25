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
import { useState } from "react";
import { Link } from "react-router";
import { useLocalStorage } from "usehooks-ts";

type FavoriteItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered";
  total: number;
  items: { name: string; quantity: number; price: number }[];
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

export default function Account() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "favorites"
  >("profile");
  const [favorites] = useLocalStorage<FavoriteItem[]>("favorites", []);
  const [orders] = useLocalStorage<Order[]>("orders", []);
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
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
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
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "orders"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Package size={18} className="mr-3" />
                <span>Order History</span>
              </button>

              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
                  activeTab === "favorites"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart size={18} className="mr-3" />
                <span>Favorites</span>
              </button>

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
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Profile Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit size={16} className="mr-2" /> Edit
                  </button>
                )}
                {isEditing && (
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editableProfile.name}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editableProfile.email}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editableProfile.phone}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editableProfile.address}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={editableProfile.city}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="postalCode"
                      value={editableProfile.postalCode}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={editableProfile.country}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.country}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package size={48} className="mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    to="/"
                    className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-md border border-gray-200 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="mb-1 font-medium">Items:</p>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} (x{item.quantity})
                            </span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between border-t border-gray-100 pt-3">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Favorites
              </h2>

              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Heart size={48} className="mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    You haven't added any favorites yet.
                  </p>
                  <Link
                    to="/"
                    className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-lg border border-gray-200"
                    >
                      <div className="h-48 overflow-hidden bg-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-md font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-gray-600">
                          ${item.price.toFixed(2)}
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
          )}
        </div>
      </div>
    </div>
  );
}
