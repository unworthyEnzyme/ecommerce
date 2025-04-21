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

export default function AddProduct({ loaderData }: Route.ComponentProps) {
  const { topCategories, attributeTypes } = loaderData;
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  return (
    <div>
      <Form method="post" className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-2">
          <legend>Product Level Attributes</legend>
          <input type="text" name="product-code" placeholder="Product Code" />
          <input type="text" name="name" placeholder="Name" />
          <textarea name="description" placeholder="Description" />
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
          >
            <option value="">Select Top Category</option>
            {topCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="sub-category-id">
            <option value="">Select Sub Category</option>
            {subCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {attributeTypes.map((attributeType) => (
            <div key={attributeType.id} className="flex flex-col gap-2">
              <label>{attributeType.name}</label>
              <input type="text" name={`attribute-${attributeType.id}`} />
            </div>
          ))}
        </fieldset>
        <fieldset>
          <legend>Variant Level Attributes</legend>
          <input type="text" name="price" placeholder="Price" />
          <input type="number" name="stock" placeholder="Stock" />
        </fieldset>
        <button>Submit</button>
      </Form>
    </div>
  );
}
