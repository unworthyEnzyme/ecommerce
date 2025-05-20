import { useState } from "react";
import { Form, redirect } from "react-router";
import { products } from "~/api/client";
import * as api from "~/api/client";
import type { Route } from "./+types/add-product";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const topCategories = await products.getTopCategories();
  const suppliers = await api.suppliers.getSuppliers();

  return { topCategories, suppliers };
}

export async function clientAction({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const name = form.get("name") as string;
  const description = form.get("description") as string;
  const topCategoryId = form.get("top-category-id") as string;
  const subCategoryId = form.get("sub-category-id") as string;
  const supplierId = form.get("supplier-id") as string;

  const { id } = await products.createProduct({
    name,
    description,
    topCategoryId,
    subCategoryId,
    supplierId,
  });
  return redirect(`/products/${id}/add-variant`);
}

interface Category {
  id: number;
  name: string;
}

export default function AddProduct({ loaderData }: Route.ComponentProps) {
  const { topCategories, suppliers } = loaderData;
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Product
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-2 text-lg font-medium text-gray-900">
              Product Level Attributes
            </legend>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <textarea
                name="description"
                placeholder="Description"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <select
                name="supplier-id"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="top-category-id"
                onChange={async (e) => {
                  const topCategoryId = e.target.value;
                  if (topCategoryId) {
                    const subCategories = await products.getSubCategories(
                      parseInt(topCategoryId),
                    );
                    setSubCategories(subCategories);
                  } else {
                    setSubCategories([]);
                  }
                }}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Top Category</option>
                {topCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="sub-category-id"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Add Product
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
