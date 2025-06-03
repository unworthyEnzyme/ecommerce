import { Form } from "react-router";
import type { Route } from "./+types/update-supplier";
import * as api from "~/api/client";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const supplier = await api.suppliers.getSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return { supplier };
}

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const supplierId = formData.get("supplierId");
  const name = formData.get("name") as string;
  const contactName = formData.get("contactName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const address = formData.get("address") as string;

  if (
    !supplierId ||
    !name ||
    !contactName ||
    !contactEmail ||
    !phoneNumber ||
    !address
  ) {
    throw new Error("All fields are required");
  }

  await api.suppliers.updateSupplier(Number(supplierId), {
    name,
    contactName,
    contactEmail,
    phoneNumber,
    address,
  });

  return { success: true };
}

export default function UpdateSupplier({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { supplier } = loaderData;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update Supplier
          </h2>
        </div>
        <Form method="put" className="mt-8 space-y-6">
          <input type="hidden" name="supplierId" value={params.id} />

          <fieldset className="space-y-4 rounded-md border border-gray-200 p-4">
            <legend className="px-2 text-lg font-medium text-gray-900">
              Supplier Information
            </legend>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Supplier Name"
                defaultValue={supplier.name}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="contactName"
                placeholder="Contact Name"
                defaultValue={supplier.contactName}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="contactEmail"
                placeholder="Contact Email"
                defaultValue={supplier.contactEmail}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                defaultValue={supplier.phoneNumber}
                className="mb-3 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <textarea
                name="address"
                placeholder="Address"
                defaultValue={supplier.address}
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
              Update Supplier
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
