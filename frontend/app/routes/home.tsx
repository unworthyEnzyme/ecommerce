import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <p>hello, world!</p>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/products/add">Add Product</Link>
      <Link to="/products/create-attribute-type">Create Attribute</Link>
    </div>
  );
}
