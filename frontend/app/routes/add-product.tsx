import { Form } from "react-router";
import type { Route } from "./+types/add-product";
import { products } from "~/api/client";
import { useState } from "react";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const topCategories = await products.getTopCategories();
  const attributeTypes = await products.getAttributeTypes();

  return { topCategories, attributeTypes };
}

interface Category {
  id: number;
  name: string;
}

type AttributeType = {
  id: number;
  name: string;
};

interface Attribute {
  id: number;
  name: string;
  type: AttributeType;
  value: string;
}

export default function AddProduct({ loaderData }: Route.ComponentProps) {
  const { topCategories, attributeTypes } = loaderData;
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [currentAttributeType, setCurrentAttributeType] =
    useState<AttributeType>(attributeTypes[0]);
  const unusedAttributeTypes = attributeTypes.filter(
    (type) => !attributes.some((attr) => attr.id === type.id),
  );

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
                name="product-code"
                placeholder="Product Code"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
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
          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-2 text-lg font-medium text-gray-900">
              Variant Level Attributes
            </legend>
            <div>
              <input
                type="text"
                name="price"
                placeholder="Price"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            {attributes.map((attribute) => (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {attribute.name}
                </label>
                <input
                  type="text"
                  name={`attribute-${attribute.id}`}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            ))}
            <select
              name="_attribute-type-id"
              onChange={(e) => {
                const attributeTypeId = e.target.value;
                const attributeType = attributeTypes.find(
                  (type) => type.id === parseInt(attributeTypeId),
                );
                if (attributeType) {
                  setCurrentAttributeType(attributeType);
                }
              }}
              className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select Attribute Type</option>
              {unusedAttributeTypes.map((attributeType) => (
                <option key={attributeType.id} value={attributeType.id}>
                  {attributeType.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="mb-3 block w-full appearance-none rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              disabled={!currentAttributeType}
              onClick={() => {
                setAttributes((prev) => [
                  ...prev,
                  {
                    id: currentAttributeType.id,
                    name: currentAttributeType.name,
                    type: currentAttributeType,
                    value: "",
                  },
                ]);
              }}
            >
              Add Attribute
            </button>
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
