"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

interface DeleteProjectButtonProps {
  projectId: number;
  projectName: string;
  deleteAction: (id: number) => Promise<void>;
}

export default function DeleteProjectButton({
  projectId,
  projectName,
  deleteAction,
}: DeleteProjectButtonProps) {
  const { pending } = useFormStatus();

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Delete "${projectName}"?`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteAction.bind(null, projectId)} onSubmit={handleDelete}>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </form>
  );
}
