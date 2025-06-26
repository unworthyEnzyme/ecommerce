import { Edit, PlusCircle, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { href, Link, useOutletContext } from "react-router";
import * as client from "~/api/client";
import { auth } from "../api/client";
import type { UserProfile } from "./account.layout";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";

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
    <Card>
      <Box p="6">
        <Flex justify="between" align="center" mb="6">
          <Heading size="6">Profile Information</Heading>
          {!isEditing ? (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              color="indigo"
            >
              <Edit size={16} />
              Edit
            </Button>
          ) : (
            <Flex gap="3">
              <Button variant="ghost" onClick={saveProfile} color="green">
                <Save size={16} />
                Save
              </Button>
              <Button variant="ghost" onClick={cancelEditing} color="red">
                <X size={16} />
                Cancel
              </Button>
            </Flex>
          )}
        </Flex>

        <Grid columns="2" gap="6" mb="8">
          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Email
            </Text>
            <Text as="p" size="3" mt="1">
              {profile.email}
            </Text>
          </Box>

          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              First Name
            </Text>
            {isEditing ? (
              <TextField.Root
                mt="1"
                placeholder="Enter your first name"
                value={editableProfile.firstName || ""}
                onChange={(e) => handleProfileChange(e)}
                name="firstName"
              />
            ) : (
              <Text as="p" size="3" mt="1">
                {profile.firstName || (
                  <Text color="gray" style={{ fontStyle: "italic" }}>
                    Not provided
                  </Text>
                )}
              </Text>
            )}
          </Box>

          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Last Name
            </Text>
            {isEditing ? (
              <TextField.Root
                mt="1"
                placeholder="Enter your last name"
                value={editableProfile.lastName || ""}
                onChange={(e) => handleProfileChange(e)}
                name="lastName"
              />
            ) : (
              <Text as="p" size="3" mt="1">
                {profile.lastName || (
                  <Text color="gray" style={{ fontStyle: "italic" }}>
                    Not provided
                  </Text>
                )}
              </Text>
            )}
          </Box>

          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Phone Number
            </Text>
            {isEditing ? (
              <TextField.Root
                mt="1"
                type="tel"
                placeholder="Enter your phone number"
                value={editableProfile.phoneNumber || ""}
                onChange={(e) => handleProfileChange(e)}
                name="phoneNumber"
              />
            ) : (
              <Text as="p" size="3" mt="1">
                {profile.phoneNumber || (
                  <Text color="gray" style={{ fontStyle: "italic" }}>
                    Not provided
                  </Text>
                )}
              </Text>
            )}
          </Box>
        </Grid>

        <Box>
          <Flex justify="between" align="center" mb="4">
            <Heading size="5">Addresses</Heading>
            <Button asChild variant="ghost" color="indigo">
              <Link to={href("/account/address/new")}>
                <PlusCircle size={16} />
                Add Address
              </Link>
            </Button>
          </Flex>

          {profile.addresses && profile.addresses.length > 0 ? (
            <Flex direction="column" gap="4">
              {profile.addresses.map((address) => (
                <Card key={address.userAddressId}>
                  <Box p="4">
                    <Grid columns="2" gap="4">
                      <Flex direction="column">
                        <Text size="2" color="gray" weight="medium">
                          Address Line 1
                        </Text>
                        <Text size="3">{address.addressLine1}</Text>
                      </Flex>
                      {address.addressLine2 && (
                        <Flex direction="column">
                          <Text size="2" color="gray" weight="medium">
                            Address Line 2
                          </Text>
                          <Text size="3">{address.addressLine2}</Text>
                        </Flex>
                      )}
                      <Flex direction="column">
                        <Text size="2" color="gray" weight="medium">
                          City
                        </Text>
                        <Text size="3">{address.city}</Text>
                      </Flex>
                      <Flex direction="column">
                        <Text size="2" color="gray" weight="medium">
                          Postal Code
                        </Text>
                        <Text size="3">{address.postalCode}</Text>
                      </Flex>
                      <Flex direction="column">
                        <Text size="2" color="gray" weight="medium">
                          Country
                        </Text>
                        <Text size="3">{address.country}</Text>
                      </Flex>
                      <Flex direction="column">
                        <Text size="2" color="gray" weight="medium">
                          Phone Number
                        </Text>
                        <Text size="3">{address.phoneNumber}</Text>
                      </Flex>
                    </Grid>
                    <Flex justify="end" align="center" gap="4" mt="3">
                      <Button asChild variant="ghost" size="2" color="indigo">
                        <Link to={`/account/address/${address.userAddressId}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="2"
                        color="red"
                        onClick={() =>
                          handleDeleteAddress(address.userAddressId)
                        }
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </Flex>
                  </Box>
                </Card>
              ))}
            </Flex>
          ) : (
            <Card>
              <Box p="8" style={{ textAlign: "center" }}>
                <Text color="gray" mb="2" as="p">
                  You haven't added any addresses yet.
                </Text>
                <Button asChild variant="ghost" color="indigo">
                  <Link to={href("/account/address/new")}>
                    Add your first address
                  </Link>
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      </Box>
    </Card>
  );
}
