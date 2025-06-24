import { Form, Link, href, redirect } from "react-router";
import { auth, cart } from "../api/client";
import type { Route } from "./+types/login";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const response = await auth.login(email, password);
    localStorage.setItem("token", response.token);

    try {
      // Get local cart and merge with server cart
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length > 0) {
        const cartItems = localCart.map((item: any) => ({
          variantId: parseInt(item.id),
          quantity: item.amount,
        }));
        await cart.mergeLocalCart(cartItems);
      }

      const mergedCart = await cart.getCart();
      const items = mergedCart.items.map((item) => ({
        id: item.variant.id.toString(),
        price: item.variant.price,
        name: item.variant.name,
        attributes: item.variant.attributes.reduce(
          (acc: Record<string, string>, attr) => {
            acc[attr.attributeName] = attr.attributeValue;
            return acc;
          },
          {},
        ),
        amount: item.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(items));
      console.log("Cart merged successfully:", items);
    } catch (cartError) {
      console.error("Cart merge failed:", cartError);
      // Clear local cart on merge failure to prevent issues
      localStorage.removeItem("cart");
      return {
        error:
          "Login successful, but there was an issue merging your cart. Your cart has been cleared.",
      };
    }

    return redirect("/");
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Invalid email or password" };
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const error = actionData?.error;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        <Form method="post" className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                type="email"
                name="email"
                required
                className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Sign in
            </button>
          </div>
        </Form>
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to={href("/signup")}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
