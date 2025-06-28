import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/notdb";
import { requireAuth } from "@/lib/server/auth";
import type {
  CreateCollectionRequest,
  CollectionsResponse,
  CollectionResponse,
} from "@/lib/types/collection";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const collections = await db.collections.find({
      filter: { user_id: user.id },
      offset: (page - 1) * limit,
      limit: limit,
    });

    const total = await db.collections.count({ filter: { user_id: user.id } });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      collections,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await request.json()) as CreateCollectionRequest;
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const collection = await db.collections.insert({
      name: body.name,
      description: body.description || "",
      user_id: user.id,
    });
    return NextResponse.json({ collection });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
