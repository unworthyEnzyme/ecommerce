import { Heart, LogOut, Package, ShoppingBag, User } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { auth } from "../api/client";

export type Address = {
  userAddressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt?: string;
};

export type UserProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addresses: Address[];
};

const Sidebar = ({ profile }: { profile: UserProfile }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const displayName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.email;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <User className="text-indigo-600" size={24} />
        </div>
        <div className="ml-4">
          <p className="font-medium text-gray-800">{displayName}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {[
          {
            id: "profile",
            path: "/account/profile",
            icon: User,
            label: "Profile",
          },
          {
            id: "orders",
            path: "/account/orders",
            icon: Package,
            label: "Order History",
          },
          {
            id: "favorites",
            path: "/account/favorites",
            icon: Heart,
            label: "Favorites",
          },
        ].map(({ id, path, icon: Icon, label }) => (
          <Link
            key={id}
            to={path}
            className={`flex w-full items-center rounded-md px-3 py-2 text-left ${
              currentPath === path
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon size={18} className="mr-3" />
            <span>{label}</span>
          </Link>
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
};

export default function AccountLayout() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await auth.getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">
            <div className="spinner-border mb-4 h-8 w-8 text-indigo-600"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-600">{error || "Unable to load profile"}</p>
          <button
            className="mt-2 text-indigo-600 hover:underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">My Account</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Sidebar profile={profile} />
        </div>
        <div className="md:col-span-3">
          <Outlet context={{ profile, setProfile }} />
        </div>
      </div>
    </div>
  );
}
