import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { db } from "@/lib/server/notdb";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPublic = searchParams.get("public");

    // Build query filters
    let filter: any = {};

    if (isPublic === "true") {
      filter.is_public = true;
    } else if (isPublic === "false") {
      filter.is_public = false;
      filter.user_id = user.id; // Only show user's private snippets
    } else {
      // Default: show user's snippets and public snippets
      // Note: NotDB doesn't support $or, so we'll fetch all and filter in memory
      filter = {};
    }

    // Fetch snippets
    const allSnippets = await db.snippets.find({
      filter,
    });

    // Apply additional filtering for mixed public/private view
    let snippets = allSnippets;
    if (isPublic !== "true" && isPublic !== "false") {
      snippets = allSnippets.filter(
        (snippet) => snippet.user_id === user.id || snippet.is_public === true
      );
    }

    // Sort by creation date (newest first)
    snippets.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedSnippets = snippets.slice(offset, offset + limit);

    return NextResponse.json({
      snippets: paginatedSnippets,
      pagination: {
        page,
        limit,
        total: snippets.length,
        totalPages: Math.ceil(snippets.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching snippets:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate required fields
    const { title, description, code, language, is_public = false } = body;

    if (!title || !description || !code || !language) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, description, code, language",
        },
        { status: 400 }
      );
    }

    // Create new snippet
    const snippet = await db.snippets.insert({
      title,
      description,
      code,
      language,
      is_public: Boolean(is_public),
      user_id: user.id,
    });

    return NextResponse.json({ snippet }, { status: 201 });
  } catch (error) {
    console.error("Error creating snippet:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}
