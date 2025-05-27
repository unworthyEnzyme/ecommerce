import { Outlet } from "react-router";
import { isAdmin, isTokenExpired } from "~/lib/jwt";
import type { Route } from "./+types/admin-layout";

export async function clientLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Response("Not Found", { status: 404 });
  }

  if (isTokenExpired(token)) {
    // Clear expired token
    localStorage.removeItem("token");
    throw new Response("Not Found", { status: 404 });
  }

  if (!isAdmin(token)) {
    throw new Response("Not Found", { status: 404 });
  }

  return { isAdmin: true };
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return <Outlet />;
}
