import React from "react";
import { Collection } from "@/lib/types/collection";
import Link from "next/link";
import * as Icons from "solar-icon-set";

interface CollectionCardProps {
  collection: Collection;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link
      href={`/dashboard/collections/${collection._id}`}
      className="block h-full"
    >
      <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-colors flex flex-col gap-2 shadow-sm h-full">
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-1">
          <span className="text-lg font-medium text-white line-clamp-1 flex-1">
            {collection.name}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-1">
          <Icons.Calendar size={14} />
          <span>{formatDate(collection.createdAt)}</span>
        </div>
        {collection.description && (
          <div className="text-sm text-gray-300 line-clamp-2 mb-1">
            {collection.description}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CollectionCard;
