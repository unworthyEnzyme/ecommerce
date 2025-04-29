import { Form } from "react-router";
import type { Route } from "./+types/add-variant";
import * as api from "~/api/client";
import { useState } from "react";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const attributeTypes = await api.products.getAttributeTypes();
  const product = await api.products.getProductById(params.id);

  return { attributeTypes, product };
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const productId = params.id;
  const form = await request.formData();
  const price = form.get("price");
  const stock = form.get("stock");
  const attributes: Array<{ id: number; value: string }> = [];
  for (const [key, value] of form.entries()) {
    if (key.startsWith("attribute-")) {
      const idMatch = key.match(/^attribute-(\d+)$/);
      if (idMatch) {
        const id = parseInt(idMatch[1], 10);
        attributes.push({ id, value: value as string });
      }
    }
  }
  const requestBody = { productId, price, stock, attributes };
  console.log(requestBody);
  return requestBody;
}

type AttributeType = {
  id: number;
  name: string;
};

interface Attribute {
  id: number;
  type: AttributeType;
  value: string;
}

export default function AddAttribute({ loaderData }: Route.ComponentProps) {
  const { attributeTypes, product } = loaderData;
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [currentAttributeType, setCurrentAttributeType] =
    useState<AttributeType>(attributeTypes[0]);
  const unusedAttributeTypes = attributeTypes.filter(
    (type) =>
      !attributes.some((attr) => attr.id === type.id) &&
      !product.attributes.some((attr) => attr.type.id === type.id),
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Product Code: {product.code}
          </p>
          <p className="mt-2 text-gray-700">{product.description}</p>
          <div className="mt-4 flex gap-4">
            <div className="text-sm">
              <span className="font-medium text-gray-500">Category:</span>{" "}
              <span className="text-gray-900">{product.topCategory.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">Subcategory:</span>{" "}
              <span className="text-gray-900">{product.subCategory.name}</span>
            </div>
          </div>
        </div>
        <Form method="post">
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
                  {attribute.type.name}
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
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Create
          </button>
        </Form>
      </div>
    </div>
  );
}
