"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "@/lib/client/collection-queries";
import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import * as Icons from "solar-icon-set";
import CollectionCard from "../components/collection-card";
import Title from "@/components/title";
import Modal from "@/components/modal";

const CollectionsPage = () => {
  const { data, isLoading, error } = useCollections({ page: 1, limit: 10 });
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const [form, setForm] = useState({ name: "", description: "" });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateCollection.mutate(
        { id: editId, data: form },
        {
          onSuccess: () => {
            setForm({ name: "", description: "" });
            setEditId(null);
            setShowModal(false);
          },
        }
      );
    } else {
      createCollection.mutate(form, {
        onSuccess: () => {
          setForm({ name: "", description: "" });
          setShowModal(false);
        },
      });
    }
  };

  const handleEdit = (collection: any) => {
    setForm({
      name: collection.name,
      description: collection.description || "",
    });
    setEditId(collection._id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    deleteCollection.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-0">
      <Title title="Collections | Dropp" />
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-medium">Collections</h2>
        <Button
          onClick={() => {
            setShowModal(true);
            setEditId(null);
          }}
        >
          Create Collection
        </Button>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditId(null);
        }}
        title={editId ? "Edit Collection" : "Create Collection"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Collection name"
            required
          />
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
          />
          <Button
            type="submit"
            loading={createCollection.isPending || updateCollection.isPending}
          >
            {editId ? "Save Changes" : "Create"}
          </Button>
        </form>
      </Modal>
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
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
            <Button onClick={() => setDeleteId(null)} className="flex-1">
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
      {isLoading && (
        <div className="flex flex-col gap-1 h-[80vh] items-center justify-center">
          <CgSpinner className="animate-spin text-gray-500" size={24} />
          <p className="text-sm">Loading collections...</p>
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && (!data || data.collections.length === 0) && (
        <div className="flex flex-col gap-4 h-[80vh] items-center justify-center">
          <Icons.Folder size={60} iconStyle="BoldDuotone" />
          <div className="text-center">
            <Button
              onClick={() => {
                setShowModal(true);
                setEditId(null);
              }}
            >
              Create your first collection
            </Button>
          </div>
        </div>
      )}
      {!isLoading && !error && data && data.collections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 items-start">
          {data.collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
