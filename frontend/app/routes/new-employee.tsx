import { Form, redirect } from "react-router";
import type { Route } from "./+types/new-employee";
import * as api from "~/api/client";
import apiClient from "~/api/client";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const suppliers = await api.suppliers.getSuppliers();

  return { suppliers };
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const supplierId = formData.get("supplier-id");

  if (!email || !supplierId) {
    return { error: "Email and Supplier ID are required" };
  }

  try {
    await apiClient.post(`/supplier/${supplierId}/employee`, {
      email,
    });
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create employee",
    };
  }
}

export default function NewEmployee({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { suppliers } = loaderData;
  const error = actionData?.error;
  const success = actionData?.success;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Employee
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              Employee created successfully!
            </div>
          </div>
        )}

        <Form method="post" className="mt-8 space-y-6">
          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-2 text-lg font-medium text-gray-900">
              Employee Information
            </legend>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
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
          </fieldset>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Create Employee
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
