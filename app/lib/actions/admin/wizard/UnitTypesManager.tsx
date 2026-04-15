"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface UnitType {
  id?: string;
  type: string;
  size: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sortOrder: number;
}

interface Props {
  data: UnitType[];
  updateData: (unitTypes: UnitType[]) => void;
  next: () => void;
  prev: () => void;
}

export default function UnitTypesManager({
  data: unitTypes,
  updateData,
  next,
  prev,
}: Props) {
  const [editing, setEditing] = useState<UnitType | null>(null);
  const [form, setForm] = useState<UnitType>({
    type: "",
    size: "",
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    sortOrder: unitTypes.length,
  });

  const resetForm = () => {
    setForm({
      type: "",
      size: "",
      price: "",
      bedrooms: 1,
      bathrooms: 1,
      sortOrder: unitTypes.length,
    });
    setEditing(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const saveUnitType = () => {
    if (!form.type) return;
    if (editing) {
      const updated = unitTypes.map((ut) =>
        ut.id === editing.id ? { ...form, id: editing.id } : ut,
      );
      updateData(updated);
    } else {
      updateData([...unitTypes, { ...form, id: Date.now().toString() }]);
    }
    resetForm();
  };

  const deleteUnitType = (id: string) => {
    updateData(unitTypes.filter((ut) => ut.id !== id));
  };

  const editUnitType = (ut: UnitType) => {
    setEditing(ut);
    setForm(ut);
  };

  console.log("unit", unitTypes);

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-semibold mb-4">
          {editing ? "Edit Unit Type" : "Add New Unit Type"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="type"
            placeholder="Type name (e.g., 1 Bedroom)"
            value={form.type}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="size"
            placeholder="Size (e.g., 500 sqft)"
            value={form.size}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="price"
            placeholder="Price (e.g., Ksh 2,000,000)"
            value={form.price}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleNumberChange}
              className="px-3 py-2 border rounded w-1/2"
            />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleNumberChange}
              className="px-3 py-2 border rounded w-1/2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {editing && (
            <button
              onClick={resetForm}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
          <button
            onClick={saveUnitType}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {editing ? "Update" : "Add"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Unit Types</h3>
        {unitTypes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No unit types defined yet.
          </p>
        ) : (
          unitTypes?.map((ut) => (
            <div
              key={ut.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <span className="font-medium">{ut.type}</span>
                <span className="text-sm text-gray-500 ml-2">{ut.size}</span>
                <span className="text-sm text-gray-500 ml-2">{ut.price}</span>
                <span className="text-xs ml-2">
                  {ut.bedrooms} bed, {ut.bathrooms} bath
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editUnitType(ut)}
                  className="text-blue-500"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteUnitType(ut.id!)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prev}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          disabled={unitTypes.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Next: Floors →
        </button>
      </div>
    </div>
  );
}
