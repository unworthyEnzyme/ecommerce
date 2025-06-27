import { Heart, LogOut, Package, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { href, Link, Outlet, useLocation, useNavigate } from "react-router";
import { auth } from "~/api/client";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Separator,
  Spinner,
  Text,
} from "@radix-ui/themes";

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
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const displayName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.email;

  return (
    <Card>
      <Box p="6">
        <Flex align="center" mb="6">
          <Flex
            direction="column"
            align="start"
            style={{ minWidth: 0, flex: 1 }}
          >
            <Text
              size="3"
              weight="medium"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </Text>
            <Text
              size="2"
              color="gray"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile.email}
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" gap="1">
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
            <Box key={id}>
              <Link
                to={path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor:
                    currentPath === path ? "var(--indigo-3)" : "transparent",
                  color:
                    currentPath === path
                      ? "var(--indigo-11)"
                      : "var(--gray-12)",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (currentPath !== path) {
                    e.currentTarget.style.backgroundColor = "var(--gray-3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPath !== path) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon size={18} style={{ marginRight: "12px" }} />
                <Text>{label}</Text>
              </Link>
            </Box>
          ))}

          <Box mb="2">
            <Link
              to={href("/cart")}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "transparent",
                color: "var(--gray-12)",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--gray-3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ShoppingBag size={18} style={{ marginRight: "12px" }} />
              <Text>Cart</Text>
            </Link>
          </Box>

          <Separator my="4" size="4" />

          <Button
            variant="ghost"
            color="red"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login", { replace: true });
            }}
          >
            <LogOut size={18} style={{ marginRight: "12px" }} />
            <Text>Sign Out</Text>
          </Button>
        </Flex>
      </Box>
    </Card>
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
      <Container size="4" py="8">
        <Flex justify="center" align="center" style={{ height: "192px" }}>
          <Flex direction="column" align="center">
            <Spinner size="3" mb="4" />
            <Text>Loading profile...</Text>
          </Flex>
        </Flex>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container size="4" py="8">
        <Card>
          <Box p="4" style={{ backgroundColor: "var(--red-3)" }}>
            <Text color="red">{error || "Unable to load profile"}</Text>
            <Button
              variant="ghost"
              color="blue"
              mt="2"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="4" py="8">
      <Heading size="6" mb="8">
        My Account
      </Heading>
      <Grid columns={{ initial: "1", md: "4" }} gap="6">
        <Box style={{ gridColumn: "span 1" }}>
          <Sidebar profile={profile} />
        </Box>
        <Box style={{ gridColumn: "span 3" }}>
          <Outlet context={{ profile, setProfile }} />
        </Box>
      </Grid>
    </Container>
  );
}
