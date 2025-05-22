import { Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

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

  const saveProfile = () => {
    setProfile(editableProfile);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditableProfile(profile);
    setIsEditing(false);
  };

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
}
