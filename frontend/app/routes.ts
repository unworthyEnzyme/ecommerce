import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  //TODO: Only users who have access to the admin panel should be able to access this route
  route("products/add", "routes/add-product.tsx"),
  route("products/create-attribute-type", "routes/create-attribute-type.tsx"),
  route("products/:id/add-attribute", "routes/add-attribute.tsx"),
  route("products/:id/edit", "routes/edit-product.tsx"),
  route("products/:id", "routes/product.tsx"),
] satisfies RouteConfig;
