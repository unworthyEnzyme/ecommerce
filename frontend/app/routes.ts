import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  layout("routes/root-layout.tsx", [
    index("routes/home.tsx"),
    route(
      "categories/:topCategoryId/subcategories/:subcategoryId",
      "routes/products-by-subcategory.tsx",
    ),
    //TODO: Only users who have access to the admin panel should be able to access this route
    route("products/add", "routes/add-product.tsx"),
    route("products/create-attribute-type", "routes/create-attribute-type.tsx"),
    route("products/:id/add-variant", "routes/add-variant.tsx"),
    route("products/:id/edit", "routes/edit-product.tsx"),
    route("products/:id", "routes/product.tsx"),
    route("cart", "routes/cart.tsx"),
    route("payment", "routes/payment.tsx"),
    route("account", "routes/account.tsx"),
    route("order-confirmation", "routes/order-confirmation.tsx"),
    route("order-details/:id", "routes/order-details.tsx"),
  ]),
] satisfies RouteConfig;
