"use client";

import { useFormStatus } from "react-dom";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  action: (formData: FormData) => void;
  initialData?: {
    name: string;
    location: string;
    address: string;
    units: number;
    price: string;
    description: string;
    longDescription: string;
    status: string;
    completionDate: string;
    developer: string;
    contactEmail: string;
    contactPhone: string;
  };
  isEdit?: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const isEdit = useRef(false);
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      {pending ? "Saving..." : isEdit ? "Update Project" : "Create Project"}
    </button>
  );
}

export default function ProjectForm({
  action,
  initialData,
  isEdit = false,
}: ProjectFormProps) {
  const router = useRouter();

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Name *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location *
          </label>
          <input
            type="text"
            name="location"
            defaultValue={initialData?.location}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Address *
        </label>
        <input
          type="text"
          name="address"
          defaultValue={initialData?.address}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Units *
          </label>
          <input
            type="number"
            name="units"
            defaultValue={initialData?.units}
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Base Price *
          </label>
          <input
            type="text"
            name="price"
            defaultValue={initialData?.price}
            required
            placeholder="e.g., Ksh 2,500,000"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Short Description
        </label>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Long Description
        </label>
        <textarea
          name="longDescription"
          defaultValue={initialData?.longDescription}
          rows={6}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            defaultValue={initialData?.status || "ongoing"}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Completion Date
          </label>
          <input
            type="text"
            name="completionDate"
            defaultValue={initialData?.completionDate}
            placeholder="e.g., Q4 2025"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Developer
        </label>
        <input
          type="text"
          name="developer"
          defaultValue={initialData?.developer}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            defaultValue={initialData?.contactEmail}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            defaultValue={initialData?.contactPhone}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <SubmitButton />
      </div>
    </form>
  );
}
