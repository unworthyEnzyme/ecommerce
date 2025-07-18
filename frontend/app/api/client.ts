import { faker } from "@faker-js/faker";
import axios from "axios";
import type { UserProfile } from "../routes/account.layout";

const apiClient = axios.create({
  baseURL: "https://localhost:7215/api",
  headers: {
    "Content-Type": "application/json",
  },
});

type CreateProductBody = {
  name: string;
  description: string;
  topCategoryId: string;
  subCategoryId: string;
  supplierId: string;
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
  async getProfile() {
    const token = localStorage.getItem("token");
    const response = await apiClient.get<UserProfile>("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  async updateProfile(profile: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.put("/auth/profile", profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};

type CreateVariantBody = {
  productId: string;
  price: string;
  stock: string;
  attributes: {
    id: number;
    value: string;
  }[];
  images: {
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
};

export type Variant = {
  id: number;
  name: string;
  price: number;
  stock: number;
  product: {
    productId: number;
    productCode: string;
    name: string;
    description: string;
    topCategory: {
      id: number;
      name: string;
    };
    subCategory: {
      id: number;
      name: string;
      topCategoryId: number;
    };
  };
  attributes: {
    attributeName: string;
    attributeValue: string;
  }[];
  images: {
    imageId: number;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
};

type AttributeOption = {
  id: number;
  name: string;
  values: string[];
};

export const variants = {
  async create(
    payload: CreateVariantBody,
  ): Promise<{ id: number; message: string }> {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.post("/variant", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async getAll() {
    const { data } = await apiClient.get<{
      variants: Variant[];
      attributeOptions: AttributeOption[];
    }>("/variant");
    return data;
  },

  async getById(id: number) {
    interface VariantDetail extends Variant {
      isFavorite: boolean;
    }
    const { data } = await apiClient.get<{
      variant: VariantDetail;
      attributeOptions: AttributeOption[];
    }>(`/variant/${id}`);
    return data;
  },

  async getAllByCategories(topCategoryId: string, subCategoryId: string) {
    const { data } = await apiClient.get<{
      variants: Variant[];
      attributeOptions: AttributeOption[];
    }>(`/variant/category/${topCategoryId}/subcategory/${subCategoryId}`);
    return data;
  },

  async filterVariants(params: {
    topCategoryId?: string;
    subCategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    attributeFilters?: Record<number, string[]>;
  }) {
    const queryParams = new URLSearchParams();
    if (params.topCategoryId)
      queryParams.append("topCategoryId", params.topCategoryId);
    if (params.subCategoryId)
      queryParams.append("subCategoryId", params.subCategoryId);
    if (params.minPrice !== undefined)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      queryParams.append("maxPrice", params.maxPrice.toString());

    // Add attribute filters to query params using attribute IDs
    if (params.attributeFilters) {
      Object.entries(params.attributeFilters).forEach(([id, values]) => {
        values.forEach((value) => {
          queryParams.append(`attributes[${id}]`, value);
        });
      });
    }

    const { data } = await apiClient.get<{
      variants: Variant[];
      attributeOptions: AttributeOption[];
    }>(`/variant/filter?${queryParams}`);
    return data;
  },

  async getVariantByAttributeOptions(
    productId: number,
    attributeOptions: Record<number, string>,
  ) {
    const queryParams = new URLSearchParams();
    queryParams.append("productId", productId.toString());

    // Add attribute options to query params
    Object.entries(attributeOptions).forEach(([id, value]) => {
      queryParams.append(`attributeOptions[${id}]`, value);
    });

    const { data } = await apiClient.get<Variant | null>(
      `/variant/variant-by-attribute-options?${queryParams}`,
    );
    return data;
  },
};

export const products = {
  getProductById: async (id: string) => {
    type Result = {
      productId: number;
      productCode: string;
      name: string;
      description: string;
      subCategory: {
        topCategoryId: number;
        id: number;
        name: string;
      };
      topCategory: {
        id: number;
        name: string;
      };
    };
    const { data } = await apiClient.get<Result>(`/product/${id}`);
    return {
      id: data.productId,
      code: data.productCode,
      name: data.name,
      description: data.description,
      topCategory: data.topCategory,
      subCategory: data.subCategory,
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

  async createProduct(
    product: CreateProductBody,
  ): Promise<{ id: number; message: string }> {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.post("/product", product, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return data;
  },
  async updateProduct(
    id: string,
    product: {
      name: string;
      description: string;
      topCategoryId: string;
      subCategoryId: string;
    },
  ): Promise<{ message: string }> {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.put(`/product/${id}`, product, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return data;
  },
  getTopCategories: async () => {
    type Result = {
      id: number;
      name: string;
    };
    const { data } = await apiClient.get<Result[]>("/category/top-categories");
    return data;
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
      id: number;
      name: string;
      topCategoryId: number;
    };
    const { data } = await apiClient.get<Result[]>(
      `/category/sub-categories/${categoryId}`,
    );
    return data;
  },

  getAttributeTypes: async () => {
    type Result = {
      id: number;
      name: string;
    };
    const { data } = await apiClient.get<Result[]>("/AttributeType");
    return data;
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

export const assets = {
  uploadFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const token = localStorage.getItem("token");
    const { data } = await apiClient.post<string[]>(
      "/assets/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    );
    return data;
  },

  getFile(filename: string) {
    const token = localStorage.getItem("token");
    return apiClient.get<string>(`/assets/${filename}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  },
};

export const cart = {
  clear: async () => {
    const token = localStorage.getItem("token");
    return await apiClient.delete("/ShoppingCart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  mergeLocalCart: async (
    items: Array<{
      variantId: number;
      quantity: number;
    }>,
  ) => {
    const token = localStorage.getItem("token");
    return await apiClient.post("/ShoppingCart/merge", items, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getCart: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    type CartItem = {
      cartItemId: number;
      variant: Variant;
      quantity: number;
      subTotal: number;
    };
    type Cart = {
      cartId: number;
      items: CartItem[];
      totalAmount: number;
    };
    const { data } = await apiClient.get<Cart>("/ShoppingCart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};

export const orders = {
  async createOrder(orderData: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    items: Array<{
      variantId: number;
      quantity: number;
    }>;
  }): Promise<{ orderId: number; message: string }> {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.post("/order", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};

export const favorites = {
  async getAll() {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.get<
      Array<{
        id: number;
        variant: Variant;
      }>
    >("/favorite", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async add(variantId: number) {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.post<{ id: number; message: string }>(
      "/favorite",
      { variantId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  },

  async remove(id: number) {
    const token = localStorage.getItem("token");
    await apiClient.delete(`/favorite/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

interface Supplier {
  id: number;
  name: string;
  contactName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
}

export const suppliers = {
  getSuppliers: async () => {
    interface Supplier {
      id: number;
      name: string;
      contactName: string;
      contactEmail: string;
      phoneNumber: string;
      address: string;
      createdAt: string;
    }
    const { data } = await apiClient.get<Supplier[]>("/supplier", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  },
  getSupplierById: async (id: string) => {
    interface Supplier {
      id: number;
      name: string;
      contactName: string;
      contactEmail: string;
      phoneNumber: string;
      address: string;
      createdAt: string;
    }
    const { data } = await apiClient.get<Supplier>(`/supplier/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  },

  getSupplierStatistics: async (id: string) => {
    interface Statistics {
      totalOrders: number;
      revenue: number;
      averageOrderValue: number;
      monthlySales: number[];
      monthlyRevenue: number[];
      categoryDistribution: Array<{
        name: string;
        value: number;
      }>;
      topProducts: Array<{
        name: string;
        totalSold: number;
        revenue: number;
        lastOrderDate: string;
        variant: Variant;
      }>;
    }
    const { data } = await apiClient.get<Statistics>(
      `/supplier/${id}/statistics`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return data;
  },

  async updateSupplier(id: number, data: Partial<Supplier>) {
    const token = localStorage.getItem("token");
    const { data: response } = await apiClient.put(`/supplier/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
};

export const userAddress = {
  async getById(id: number) {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.get(`/UserAddress/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async updateById(
    id: number,
    addressData: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      country: string;
      postalCode: string;
      phoneNumber: string;
    },
  ) {
    const token = localStorage.getItem("token");
    const { data } = await apiClient.put(`/UserAddress/${id}`, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async deleteById(id: number) {
    const token = localStorage.getItem("token");
    await apiClient.delete(`/UserAddress/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default apiClient;
