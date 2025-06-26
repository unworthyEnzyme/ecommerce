import { useState } from "react";
import { href, Link, useNavigate, useOutletContext } from "react-router";
import apiClient from "~/api/client";
import type { UserProfile } from "./account.layout";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  TextField,
  Select,
} from "@radix-ui/themes";

type AccountContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
};

export default function NewAddressForm() {
  const { profile, setProfile } = useOutletContext<AccountContextType>();
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await apiClient.post(
        "/UserAddress",
        { ...address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("Failed to save address");
      }
      console.log("Address saved successfully:", response.data);
      const updatedProfile = {
        ...profile,
        addresses: [...(profile.addresses || []), response.data],
      };
      setProfile(updatedProfile);
      navigate("/account/profile");
    } catch (err) {
      console.error("Failed to save address:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save address. Please try again.",
      );
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
    <Card>
      <Box p="6">
        <Flex justify="between" align="center" mb="6">
          <Heading size="6">Add New Address</Heading>
        </Flex>

        {error && (
          <Box
            mb="4"
            p="4"
            style={{ backgroundColor: "var(--red-3)", color: "var(--red-11)" }}
          >
            {error}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid columns="2" gap="6" mb="8">
            <Box style={{ gridColumn: "span 2" }}>
              <Text as="label" size="2" weight="medium" color="gray">
                Address Line 1 *
              </Text>
              <TextField.Root
                mt="1"
                name="addressLine1"
                required
                value={address.addressLine1}
                onChange={handleChange}
                placeholder="Street address"
              />
            </Box>

            <Box style={{ gridColumn: "span 2" }}>
              <Text as="label" size="2" weight="medium" color="gray">
                Address Line 2
              </Text>
              <TextField.Root
                mt="1"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" color="gray">
                City *
              </Text>
              <TextField.Root
                mt="1"
                name="city"
                required
                value={address.city}
                onChange={handleChange}
                placeholder="City"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" color="gray">
                Postal Code *
              </Text>
              <TextField.Root
                mt="1"
                name="postalCode"
                required
                value={address.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" color="gray">
                Country *
              </Text>
              <Box>
                <Select.Root
                  name="country"
                  required
                  value={address.country}
                  onValueChange={(value) =>
                    setAddress((prev) => ({ ...prev, country: value }))
                  }
                >
                  <Select.Trigger mt="1" placeholder="Select a country" />
                  <Select.Content>
                    <Select.Item value="Turkey">Turkey</Select.Item>
                    <Select.Item value="United States">
                      United States
                    </Select.Item>
                    <Select.Item value="United Kingdom">
                      United Kingdom
                    </Select.Item>
                    <Select.Item value="Germany">Germany</Select.Item>
                    <Select.Item value="France">France</Select.Item>
                    <Select.Item value="Canada">Canada</Select.Item>
                    <Select.Item value="Australia">Australia</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" color="gray">
                Phone Number *
              </Text>
              <TextField.Root
                mt="1"
                type="tel"
                name="phoneNumber"
                required
                value={address.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </Box>
          </Grid>

          <Flex justify="end" align="center" gap="3">
            <Button asChild variant="ghost">
              <Link to={href("/account/profile")}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </Flex>
        </form>
      </Box>
    </Card>
  );
}
