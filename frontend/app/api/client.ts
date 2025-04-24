import axios from "axios";
import { faker } from "@faker-js/faker";

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
