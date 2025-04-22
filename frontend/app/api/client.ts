import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7215/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
      name: "Sample Product",
      description: "Sample Description",
      topCategory: { id: 1, name: "Electronics" },
      subCategory: { id: 1, name: "Mobile Phones" },
      attributes: [
        { id: 1, type: { id: 1, name: "Brand" }, value: "Apple" },
        { id: 2, type: { id: 2, name: "Color" }, value: "Black" },
      ],
    };
  },
  getTopCategories: async () => {
    // return mock data for now
    return [
      { id: 1, name: "Electronics" },
      { id: 2, name: "Clothing" },
      { id: 3, name: "Home & Kitchen" },
      { id: 4, name: "Books" },
    ];
  },

  getSubCategories: async (categoryId: number) => {
    // return mock data for now
    return [
      { id: 1, name: "Mobile Phones" },
      { id: 2, name: "Laptops" },
      { id: 3, name: "Tablets" },
      { id: 4, name: "Cameras" },
    ];
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
};

export default apiClient;
