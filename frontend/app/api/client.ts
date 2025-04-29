import { faker } from "@faker-js/faker";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7215/api",
  headers: {
    "Content-Type": "application/json",
  },
});

type CreateProductBody = {
  productCode: string;
  name: string;
  description: string;
  topCategoryId: string;
  subCategoryId: string;
};

export const auth = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },
};

export const products = {
  getProductById: async (id: string) => {
    return {
      id: id,
      code: "P12345",
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      price: faker.commerce.price(),
      topCategory: { id: 1, name: "Electronics" },
      subCategory: { id: 1, name: "Mobile Phones" },
      attributes: [
        { id: 1, type: { id: 1, name: "Size" }, value: "S" },
        { id: 2, type: { id: 2, name: "Color" }, value: "Black" },
        { id: 3, type: { id: 3, name: "Material" }, value: "Cotton" },
      ],
    };
  },

  getProducts: async () => {
    const products = Array.from({ length: 10 }, (_, index) => {
      return {
        id: index + 1,
        code: `P${index + 1}`,
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        topCategory: { id: 1, name: "Electronics" },
        subCategory: { id: 1, name: "Mobile Phones" },
        image: faker.image.url(),
        price: faker.commerce.price(),
        attributes: [
          { id: 1, type: { id: 1, name: "Brand" }, value: "Apple" },
          { id: 2, type: { id: 2, name: "Color" }, value: "Black" },
        ],
      };
    });
    return products;
  },

  createProduct: async (product: CreateProductBody) => {
    const token = localStorage.getItem("token");
    await apiClient.post("/product", product, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  },
  getTopCategories: async () => {
    type Result = {
      topCategoryId: number;
      topCategoryName: string;
    };
    const { data } = await apiClient.get<Result[]>("/category/top-categories");
    return data.map((c) => ({
      id: c.topCategoryId,
      name: c.topCategoryName,
    }));
  },

  createTopCategory: async (name: string) => {
    const { data } = await apiClient.post("/category/top-categories", {
      name,
    });

    return { data };
  },

  createSubCategory: async (name: string, topCategoryId: string) => {
    const { data } = await apiClient.post("/product/sub-categories", {
      name,
      topCategoryId,
    });

    return { data };
  },

  getSubCategories: async (categoryId: number) => {
    type Result = {
      subCategoryId: number;
      subCategoryName: string;
      topCategoryId: number;
    };
    const { data } = await apiClient.get<Result[]>(
      `/category/sub-categories/${categoryId}`,
    );
    return data.map((c) => ({
      id: c.subCategoryId,
      name: c.subCategoryName,
    }));
  },

  getAttributeTypes: async () => {
    return [
      { id: 1, name: "Brand" },
      { id: 2, name: "Color" },
      { id: 3, name: "Size" },
      { id: 4, name: "Material" },
    ];
  },

  createAttributeType: async (name: string) => {
    console.log("Creating attribute type:", name);
    return { id: Math.random(), name };
  },

  getFilterOptions: async () => {
    return {
      priceRanges: [
        { id: 1, name: "Under $50", min: 0, max: 50 },
        { id: 2, name: "$50 - $100", min: 50, max: 100 },
        { id: 3, name: "$100 - $200", min: 100, max: 200 },
        { id: 4, name: "Over $200", min: 200, max: Infinity },
      ],
      brands: [
        { id: 1, name: "Apple" },
        { id: 2, name: "Samsung" },
        { id: 3, name: "Sony" },
        { id: 4, name: "Dell" },
      ],
      colors: [
        { id: 1, name: "Black" },
        { id: 2, name: "White" },
        { id: 3, name: "Blue" },
        { id: 4, name: "Red" },
      ],
    };
  },

  filterProducts: async (filters: {
    priceRange?: { min: number; max: number };
    brands?: string[];
    colors?: string[];
    categoryId?: number;
  }) => {
    // Mock filtering logic
    console.log("Filtering with:", filters);

    const allProducts = Array.from({ length: 20 }, (_, index) => {
      // Use faker.commerce.price() directly without parseFloat to keep it as string
      const price = faker.commerce.price();
      const brand = faker.helpers.arrayElement([
        "Apple",
        "Samsung",
        "Sony",
        "Dell",
      ]);
      const color = faker.helpers.arrayElement([
        "Black",
        "White",
        "Blue",
        "Red",
      ]);
      const categoryId = faker.helpers.arrayElement([1, 2, 3, 4]);

      return {
        id: index + 1,
        code: `P${index + 1}`,
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        topCategory: {
          id: categoryId,
          name: ["Electronics", "Clothing", "Home & Kitchen", "Books"][
            categoryId - 1
          ],
        },
        subCategory: { id: 1, name: faker.commerce.productAdjective() },
        image: faker.image.url(),
        price: price, // Now this is a string
        attributes: [
          { id: 1, type: { id: 1, name: "Brand" }, value: brand },
          { id: 2, type: { id: 2, name: "Color" }, value: color },
        ],
      };
    });

    // Apply filters
    let filteredProducts = [...allProducts];

    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter((product) => {
        // Convert string price to number for comparison
        const price = parseFloat(product.price);
        return (
          price >= filters.priceRange!.min && price <= filters.priceRange!.max
        );
      });
    }

    if (filters.brands && filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const brandAttr = product.attributes.find(
          (attr) => attr.type.name === "Brand",
        );
        return brandAttr && filters.brands!.includes(brandAttr.value);
      });
    }

    if (filters.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const colorAttr = product.attributes.find(
          (attr) => attr.type.name === "Color",
        );
        return colorAttr && filters.colors!.includes(colorAttr.value);
      });
    }

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.topCategory.id === filters.categoryId,
      );
    }

    return filteredProducts.slice(0, 10);
  },

  favorites: async () => {
    const products = Array.from({ length: 10 }, (_, index) => {
      return {
        id: index + 1,
        code: `P${index + 1}`,
        name: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        topCategory: { id: 1, name: "Electronics" },
        subCategory: { id: 1, name: "Mobile Phones" },
        image: faker.image.url(),
        price: faker.commerce.price(),
        attributes: [
          { id: 1, type: { id: 1, name: "Brand" }, value: "Apple" },
          { id: 2, type: { id: 2, name: "Color" }, value: "Black" },
        ],
      };
    });
    return products;
  },
};

export default apiClient;
