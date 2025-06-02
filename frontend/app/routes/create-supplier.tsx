import { Form, redirect } from "react-router";
import apiClient from "~/api/client";
import type { Route } from "./+types/create-supplier";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const form = await request.formData();
  const name = form.get("name");
  const contactName = form.get("contactName");
  const contactEmail = form.get("contactEmail");
  const phoneNumber = form.get("phoneNumber");
  const address = form.get("address");

  try {
    const {
      data: { id },
    } = await apiClient.post(
      "/supplier",
      {
        name,
        contactName,
        contactEmail,
        phoneNumber,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    return redirect(`/supplier/${id}`);
  } catch (error) {
    console.error("Error creating supplier:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create supplier",
    };
  }
}

export default function CreateSupplier({ actionData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New Supplier
          </h2>
        </div>
        {actionData?.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error creating supplier
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {actionData.error}
                </div>
              </div>
            </div>
          </div>
        )}
        <Form method="post" className="mt-8 space-y-6">
          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-2 text-lg font-medium text-gray-900">
              Supplier Information
            </legend>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Supplier Name"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="contactName"
                placeholder="Contact Name"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="contactEmail"
                placeholder="Contact Email"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <textarea
                name="address"
                placeholder="Address"
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
          </fieldset>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Create Supplier
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
