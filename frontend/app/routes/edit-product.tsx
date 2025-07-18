import { useState } from "react";
import { Form } from "react-router";
import * as api from "~/api/client";
import { products } from "~/api/client";
import type { Route } from "./+types/edit-product";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const product = await api.products.getProductById(params.id);
  const topCategories = await products.getTopCategories();
  return { product, topCategories };
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  try {
    const id = params.id;
    const form = await request.formData();

    const productData = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      topCategoryId: form.get("top-category-id") as string,
      subCategoryId: form.get("sub-category-id") as string,
    };

    await products.updateProduct(id, productData);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

interface Category {
  id: number;
  name: string;
}

export default function EditProduct({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { product, topCategories } = loaderData;
  const [subCategories, setSubCategories] = useState<Category[]>([
    product.subCategory,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Edit Product
          </h2>
        </div>
        {actionData?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              <strong>Error:</strong> {actionData.error}
            </div>
          </div>
        )}
        {actionData?.success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              Product updated successfully!
            </div>
          </div>
        )}
        <Form method="put" className="mt-8 space-y-6">
          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-2 text-lg font-medium text-gray-900">
              Product Level Attributes
            </legend>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={product.name}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <textarea
                name="description"
                placeholder="Description"
                defaultValue={product.description}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <select
                name="top-category-id"
                defaultValue={product.topCategory.id}
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
                defaultValue={product.subCategory.id}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              >
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
              Save Changes
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
