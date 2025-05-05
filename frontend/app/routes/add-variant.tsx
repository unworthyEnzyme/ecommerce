import { Form, redirect } from "react-router";
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
  const price = form.get("price") as string;
  const stock = form.get("stock") as string;
  const attributes: Array<{ id: number; value: string }> = [];
  const imageUrls: string[] = [];

  for (const [key, value] of form.entries()) {
    if (key.startsWith("attribute-")) {
      const idMatch = key.match(/^attribute-(\d+)$/);
      if (idMatch) {
        const id = parseInt(idMatch[1], 10);
        attributes.push({ id, value: value as string });
      }
    } else if (key.startsWith("image-")) {
      imageUrls.push(value as string);
    }
  }

  const images = imageUrls.map((imageUrl, index) => ({
    imageUrl,
    isPrimary: index === 0, // First image is primary
    sortOrder: index, // Use index as sort order
  }));

  const requestBody = { productId, price, stock, attributes, images };
  const { id } = await api.variants.create(requestBody);
  return redirect(`/products/${id}`);
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
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; name: string }>
  >([]);
  console.log(uploadedImages);
  const unusedAttributeTypes = attributeTypes.filter(
    (type) => !attributes.some((attr) => attr.id === type.id),
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const filesToUpload = Array.from(event.target.files);
    try {
      const uploadedUrls = await api.assets.uploadFiles(filesToUpload);
      const newImages = uploadedUrls.map((url, index) => ({
        url,
        name: filesToUpload[index].name,
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

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

            {/* Image Upload Section */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {uploadedImages.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Uploaded files:</p>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {uploadedImages.map((img, idx) => (
                      <li key={idx}>{img.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Hidden inputs for image URLs */}
              {uploadedImages.map((img, idx) => (
                <input
                  key={idx}
                  type="hidden"
                  name={`image-${idx}`}
                  value={img.url}
                />
              ))}
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
