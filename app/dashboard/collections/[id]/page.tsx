"use client";

import { useCollection } from "@/lib/client/collection-queries";
import {
  useUpdateCollection,
  useDeleteCollection,
} from "@/lib/client/collection-queries";
import { useSnippets } from "@/lib/client/snippet-queries";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import * as Icons from "solar-icon-set";
import Title from "@/components/title";
import SnippetCard from "../../components/snippet-card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import Modal from "@/components/modal";

const CollectionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const { data, isLoading, error } = useCollection(id);
  const { data: snippetsData, isLoading: snippetsLoading } = useSnippets({
    collection_id: id,
  });
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  React.useEffect(() => {
    if (data?.collection) {
      setForm({
        name: data.collection.name,
        description: data.collection.description || "",
      });
    }
  }, [data]);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollection.mutate(
      { id, data: form },
      {
        onSuccess: () => {
          setShowEditModal(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCollection.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.push("/dashboard/collections");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 h-[80vh] items-center justify-center">
        <CgSpinner className="animate-spin text-gray-500" size={24} />
        <p className="text-sm">Loading collection...</p>
      </div>
    );
  }

  if (error || !data?.collection) {
    return (
      <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
        <Icons.Folder size={60} iconStyle="BoldDuotone" />
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">
            Collection Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            {error?.message ||
              "The collection you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  const collection = data.collection;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
      <Title title={collection.name + " | Dropp"} />
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {collection.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Icons.Calendar size={16} />
              <span>{new Date(collection.createdAt).toLocaleString()}</span>
            </div>
            {collection.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {collection.description}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowEditModal(true)}>
              <Icons.Pen size={16} className="mr-2" /> Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              <Icons.TrashBinTrash size={16} className="mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Collection"
      >
        <form onSubmit={handleEdit} className="flex flex-col gap-4 max-w-md">
          <Input
            name="name"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
            placeholder="Collection name"
            required
          />
          <Textarea
            name="description"
            value={form.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Description (optional)"
          />
          <Button type="submit" loading={updateCollection.isPending}>
            Save Changes
          </Button>
        </form>
      </Modal>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Collection"
        size="sm"
      >
        <div className="text-center">
          <Icons.TrashBinTrash
            size={48}
            className="mx-auto mb-4 text-red-400"
          />
          <h3 className="text-lg font-medium text-white mb-2">Are you sure?</h3>
          <p className="text-gray-400 mb-6">
            This action cannot be undone. This will permanently delete the
            collection.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleteCollection.isPending}
              disabled={deleteCollection.isPending}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {deleteCollection.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
      <h2 className="text-xl font-medium mb-4">Snippets in this Collection</h2>
      {snippetsLoading ? (
        <div className="flex flex-col gap-1 items-center justify-center">
          <CgSpinner className="animate-spin text-gray-500" size={24} />
          <p className="text-sm">Loading snippets...</p>
        </div>
      ) : snippetsData && snippetsData.snippets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {snippetsData.snippets.map((snippet) => (
            <SnippetCard key={snippet._id} snippet={snippet} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No snippets in this collection yet.</p>
      )}
    </div>
  );
};

export default CollectionDetailPage;
