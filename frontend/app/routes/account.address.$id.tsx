import { useState, useEffect } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router";
import { Link } from "react-router";
import { userAddress } from "~/api/client";
import type { UserProfile } from "./account.layout";

type AccountContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export default function AddressForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, setProfile } = useOutletContext<AccountContextType>();
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postalCode: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!id) {
        setError("No address ID provided");
        setIsLoadingAddress(false);
        return;
      }

      try {
        const addressData = await userAddress.getById(parseInt(id));
        setAddress({
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2 || "",
          city: addressData.city,
          country: addressData.country,
          postalCode: addressData.postalCode,
          phoneNumber: addressData.phoneNumber,
        });
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setError("Failed to load address. Please try again.");
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error("No address ID provided");
      }

      await userAddress.updateById(parseInt(id), address);

      // Update the profile with the new address data
      const updatedProfile = {
        ...profile,
        addresses: profile.addresses.map((addr) =>
          addr.userAddressId === parseInt(id) ? { ...addr, ...address } : addr,
        ),
      };
      setProfile(updatedProfile);

      // Navigate back to profile page
      navigate("/account/profile");
    } catch (err) {
      console.error("Failed to save address:", err);
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Edit Address</h2>
      </div>

      {isLoadingAddress ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading address...</div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={address.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={address.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={address.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <select
                  name="country"
                  required
                  value={address.country}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select a country</option>
                  <option value="Turkey">Turkey</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  {/* Add more countries as needed */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={address.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Link
                to="/account/profile"
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
