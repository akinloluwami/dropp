import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { db } from "@/lib/server/notdb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;

    // Find snippet by ID
    const snippets = await db.snippets.find({
      filter: {
        _id: id,
      },
    });

    if (snippets.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const snippet = snippets[0];

    // Check if user can access this snippet
    if (!snippet.is_public && snippet.user_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ snippet });
  } catch (error) {
    console.error("Error fetching snippet:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const body = await request.json();

    // Find snippet by ID
    const snippets = await db.snippets.find({
      filter: {
        _id: id,
      },
    });

    if (snippets.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const snippet = snippets[0];

    // Check if user owns this snippet
    if (snippet.user_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Validate required fields
    const { title, description, code, language, is_public } = body;

    if (!title || !description || !code || !language) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, description, code, language",
        },
        { status: 400 }
      );
    }

    // Update snippet
    const updatedSnippet = await db.snippets.update(id, {
      title,
      description,
      code,
      language,
      is_public: Boolean(is_public),
    });

    return NextResponse.json({ snippet: updatedSnippet });
  } catch (error) {
    console.error("Error updating snippet:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update snippet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;

    // Find snippet by ID
    const snippets = await db.snippets.find({
      filter: {
        _id: id,
      },
    });

    if (snippets.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const snippet = snippets[0];

    // Check if user owns this snippet
    if (snippet.user_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete snippet
    await db.snippets.delete(id);

    return NextResponse.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("Error deleting snippet:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    );
  }
}
