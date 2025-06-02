import { Form } from "react-router";
import * as api from "~/api/client";
import type { Route } from "./+types/create-attribute-type";

export async function clientLoader() {
  const attributeTypes = await api.products.getAttributeTypes();
  return { attributeTypes };
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  try {
    const res = await api.products.createAttributeType(name);
    if (!res) {
      return { error: "Failed to create attribute type" };
    }
    return { success: true };
  } catch (error) {
    return { error: "Failed to create attribute type. Please try again." };
  }
}

export default function CreateAttributeType({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { attributeTypes } = loaderData;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Attribute Type
          </h2>
        </div>

        {actionData?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{actionData.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {actionData?.success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Attribute type created successfully!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 rounded-md border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">
            Current Attributes
          </h3>
          <ul className="space-y-2">
            {attributeTypes.map((attributeType) => (
              <li
                key={attributeType.id}
                className="rounded-md border border-gray-200 p-2"
              >
                {attributeType.name}
              </li>
            ))}
          </ul>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Attribute Type Name"
              required
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Create
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
