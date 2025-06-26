import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/notdb";
import { requireAuth } from "@/lib/server/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const collections = await db.collections.find({ filter: { _id: id } });
    if (collections.length === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }
    const collection = collections[0];
    if (collection.user_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ collection });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const collections = await db.collections.find({ filter: { _id: id } });
    if (collections.length === 0) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }
    const collection = collections[0];
    if (collection.user_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    // Set collection_id to null for all snippets in this collection
    const snippets = await db.snippets.find({ filter: { collection_id: id } });
    for (const snippet of snippets) {
      await db.snippets.update(snippet._id, { collection_id: undefined });
    }
    await db.collections.delete(id);
    return NextResponse.json({ message: "Collection deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
