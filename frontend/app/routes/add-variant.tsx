import { useState } from "react";
import { Form, redirect } from "react-router";
import * as api from "~/api/client";
import type { Route } from "./+types/add-variant";

export async function clientLoader({ params }: Route.LoaderArgs) {
  try {
    const attributeTypes = await api.products.getAttributeTypes();
    const product = await api.products.getProductById(params.id);

    return { attributeTypes, product, error: null };
  } catch (error) {
    return {
      attributeTypes: [],
      product: null,
      error: error instanceof Error ? error.message : "Failed to load data",
    };
  }
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  try {
    const productId = params.id;
    const form = await request.formData();
    const price = form.get("price") as string;
    const stock = form.get("stock") as string;
    const attributes: Array<{ id: number; value: string }> = [];
    const imageUrls: string[] = [];

    // Validation
    if (!price || !stock) {
      return { error: "Price and stock are required" };
    }

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
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create variant",
    };
  }
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

export default function AddAttribute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { attributeTypes, product, error: loaderError } = loaderData;
  const actionError = actionData?.error;
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [currentAttributeType, setCurrentAttributeType] =
    useState<AttributeType>(attributeTypes[0]);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; name: string }>
  >([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  console.log(uploadedImages);

  // Show error if product failed to load
  if (loaderError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Error Loading Product
            </h3>
            <p className="text-sm text-gray-500">
              {loaderError || "Product not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const unusedAttributeTypes = attributeTypes.filter(
    (type) => !attributes.some((attr) => attr.id === type.id),
  );
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const filesToUpload = Array.from(event.target.files);
    setUploadError(null); // Clear previous errors

    try {
      const uploadedUrls = await api.assets.uploadFiles(filesToUpload);
      const newImages = uploadedUrls.map((url, index) => ({
        url,
        name: filesToUpload[index].name,
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload files",
      );
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
        {actionError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{actionError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
              {uploadError && (
                <div className="mt-2 text-sm text-red-600">{uploadError}</div>
              )}
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
