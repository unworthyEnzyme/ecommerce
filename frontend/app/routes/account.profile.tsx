import { Edit, PlusCircle, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { href, Link, useOutletContext } from "react-router";
import * as client from "~/api/client";
import { auth } from "../api/client";
import type { UserProfile } from "./account.layout";

type AccountContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export default function ProfileTab() {
  const { profile, setProfile } = useOutletContext<AccountContextType>();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    // Reset editable profile when the main profile changes
    setEditableProfile(profile);
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      await auth.updateProfile({
        email: editableProfile.email,
        firstName: editableProfile.firstName || "",
        lastName: editableProfile.lastName || "",
        phoneNumber: editableProfile.phoneNumber || "",
      });

      setProfile(editableProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // TODO: Show error message to user
    }
  };

  const cancelEditing = () => {
    setEditableProfile(profile);
    setIsEditing(false);
  };

  const handleDeleteAddress = async (addressId: number) => {
    await client.userAddress.deleteById(addressId);
    setProfile({
      ...profile,
      addresses: profile.addresses.filter(
        (addr) => addr.userAddressId !== addressId,
      ),
    });
  };

  const mainAddress =
    profile.addresses && profile.addresses.length > 0
      ? profile.addresses[0]
      : null;

  return (
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-gray-900">{profile.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={editableProfile.firstName || ""}
              onChange={handleProfileChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          ) : (
            <p className="mt-1 text-gray-900">
              {profile.firstName || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={editableProfile.lastName || ""}
              onChange={handleProfileChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          ) : (
            <p className="mt-1 text-gray-900">
              {profile.lastName || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={editableProfile.phoneNumber || ""}
              onChange={handleProfileChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          ) : (
            <p className="mt-1 text-gray-900">
              {profile.phoneNumber || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Addresses</h3>
          <Link
            to={href("/account/address/new")}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <PlusCircle size={16} className="mr-2" /> Add Address
          </Link>
        </div>

        {profile.addresses && profile.addresses.length > 0 ? (
          <div className="space-y-4">
            {profile.addresses.map((address) => (
              <div
                key={address.userAddressId}
                className="rounded-md border border-gray-200 p-4"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Address Line 1</p>
                    <p className="text-gray-900">{address.addressLine1}</p>
                  </div>
                  {address.addressLine2 && (
                    <div>
                      <p className="text-sm text-gray-500">Address Line 2</p>
                      <p className="text-gray-900">{address.addressLine2}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-900">{address.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="text-gray-900">{address.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-gray-900">{address.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{address.phoneNumber}</p>
                  </div>{" "}
                </div>
                <div className="mt-3 flex items-center justify-end space-x-4">
                  <Link
                    to={`/account/address/${address.userAddressId}`}
                    className="flex items-center text-sm text-indigo-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteAddress(address.userAddressId)}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              You haven't added any addresses yet.
            </p>
            <Link
              to={href("/account/address/new")}
              className="mt-2 inline-block text-indigo-600 hover:underline"
            >
              Add your first address
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
