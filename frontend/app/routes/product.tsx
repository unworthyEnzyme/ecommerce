import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { AxiosError } from "axios";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { href, Link, useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import * as api from "~/api/client";
import type { Route } from "./+types/product";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const data = await api.variants.getById(Number(params.id));
  if (!data) {
    throw new Response("Product not found", { status: 404 });
  }

  return data;
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { variant, attributeOptions } = loaderData;
  const navigate = useNavigate();
  const [_cart, setCart] = useLocalStorage("cart", [] as Array<{ id: string }>);
  const [favorites, setFavorites] = useState<
    Array<{
      id: number;
      variant: { id: number };
    }>
  >([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<number, string>
  >({});
  const isInitializingRef = useRef(false);

  useEffect(() => {
    // Initialize selected attributes with current variant's values
    if (attributeOptions && variant.attributes) {
      isInitializingRef.current = true;
      const initialSelections: Record<number, string> = {};

      // Map variant attributes to attribute options
      variant.attributes.forEach(({ attributeName, attributeValue }) => {
        // Find the corresponding attribute option by name
        const matchingOption = attributeOptions.find(
          (option) => option.name === attributeName,
        );
        if (matchingOption && matchingOption.values.includes(attributeValue)) {
          initialSelections[matchingOption.id] = attributeValue;
        }
      });

      setSelectedAttributes(initialSelections);
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 0);
    }

    // Fetch favorites
    const fetchFavorites = async () => {
      try {
        const data = await api.favorites.getAll();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };
    fetchFavorites();
  }, [variant, attributeOptions]);

  // Watch for attribute selection changes and redirect to the corresponding variant
  useEffect(() => {
    const fetchVariantByAttributes = async () => {
      if (
        Object.keys(selectedAttributes).length === 0 ||
        isInitializingRef.current
      ) {
        return;
      }

      try {
        const result = await api.variants.getVariantByAttributeOptions(
          variant.product.productId,
          selectedAttributes,
        );
        if (result && result.id !== variant.id) {
          navigate(`/products/${result.id}`);
        }
      } catch (error) {
        console.error("Failed to fetch variant by attributes:", error);
      }
    };

    fetchVariantByAttributes();
  }, [selectedAttributes, variant, navigate]);

  const addToCart = () => {
    setCart((prev) => [
      ...prev,
      {
        id: variant.id.toString(),
        price: variant.price,
        name: variant.name,
        attributes: variant.attributes,
        amount: 1,
      },
    ]);
  };

  const toggleFavorite = async () => {
    try {
      const existingFavorite = favorites.find(
        (f) => f.variant.id === variant.id,
      );
      if (existingFavorite) {
        await api.favorites.remove(existingFavorite.id);
        setFavorites(favorites.filter((f) => f.variant.id !== variant.id));
      } else {
        const result = await api.favorites.add(variant.id);
        setFavorites([...favorites, { id: result.id, variant }]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Failed to toggle favorite:", error);
        }
      }
      throw error;
    }
  };

  const isFavorite = favorites.some((item) => item.variant.id === variant.id);

  return (
    <Container size="4" px="4">
      <Box mb="6">
        <Link
          to={href("/")}
          className="text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          ← Back to Products
        </Link>
      </Box>

      <Grid columns={{ initial: "1", lg: "2" }} gap="8">
        {/* Image Carousel */}
        <Card className="relative h-96 overflow-hidden">
          <div className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
            {variant.images.length > 0 ? (
              variant.images.map((image) => (
                <div
                  key={image.imageId}
                  className="h-full w-full flex-none snap-center"
                >
                  <img
                    src={`https://localhost:7215/api${image.imageUrl}`}
                    alt={`${variant.name} - Image ${image.imageId}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))
            ) : (
              <Flex
                className="h-full w-full flex-none snap-center"
                align="center"
                justify="center"
              >
                <Text color="gray">No images available</Text>
              </Flex>
            )}
          </div>
        </Card>

        {/* Product Details */}
        <Flex direction="column">
          <Box mb="4">
            <Heading size="8" mb="2" color="gray">
              {variant.name}
            </Heading>
            <Flex direction="column" gap="1">
              <Text size="6" weight="bold" color="indigo">
                ${variant.price}
              </Text>
              <Text size="2" color="gray">
                Stock: {variant.stock}
              </Text>
            </Flex>
          </Box>

          <Box mb="6">
            <Heading size="4" mb="2" color="gray">
              Categories
            </Heading>
            <Flex gap="2">
              <Badge color="indigo" variant="soft">
                {variant.product.topCategory.name}
              </Badge>
              {variant.product.subCategory && (
                <Badge color="indigo" variant="outline">
                  {variant.product.subCategory.name}
                </Badge>
              )}
            </Flex>
          </Box>

          {/* Attribute Options */}
          {attributeOptions && attributeOptions.length > 0 && (
            <Box mb="6">
              <Heading size="4" mb="3" color="gray">
                Options
              </Heading>
              <Flex direction="column" gap="4">
                {attributeOptions.map((option) => (
                  <Box key={option.id}>
                    <Text weight="medium" color="gray" mb="2" as="div">
                      {option.name}
                    </Text>
                    <Flex wrap="wrap" gap="2">
                      {option.values.map((value) => (
                        <Button
                          key={`${option.id}-${value}`}
                          variant={
                            selectedAttributes[option.id] === value
                              ? "solid"
                              : "outline"
                          }
                          size="2"
                          onClick={() => {
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [option.id]: value,
                            }));
                          }}
                        >
                          {value}
                        </Button>
                      ))}
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}

          {/* Attributes */}
          <Box mb="6">
            <Heading size="4" mb="2" color="gray">
              Specifications
            </Heading>
            <Flex direction="column" gap="2">
              {variant.attributes.map((attr, index) => (
                <Flex key={index} align="center">
                  <Text weight="medium" color="gray" mr="2">
                    {attr.attributeName}:
                  </Text>
                  <Text color="gray">{attr.attributeValue}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* Add to cart and favorite buttons */}
          <Flex gap="2" mt="auto">
            <Button onClick={addToCart} size="3" style={{ flex: 1 }}>
              Add to Cart
            </Button>
            <IconButton
              variant={isFavorite ? "soft" : "outline"}
              color={isFavorite ? "red" : "gray"}
              size="3"
              onClick={toggleFavorite}
              aria-label="Add to favorites"
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </IconButton>
          </Flex>
        </Flex>
      </Grid>
    </Container>
  );
}
