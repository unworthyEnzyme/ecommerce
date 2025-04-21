import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  //TODO: Only users who have access to the admin panel should be able to access this route
  route("products/add", "routes/add-product.tsx"),
] satisfies RouteConfig;
