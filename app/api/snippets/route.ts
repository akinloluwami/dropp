import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { db } from "@/lib/server/notdb";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPublic = searchParams.get("public");

    let filter: any = {};

    if (isPublic === "true") {
      filter.is_public = true;
    } else if (isPublic === "false") {
      filter.is_public = false;
      filter.user_id = user.id;
    } else {
      filter = {};
    }

    const allSnippets = await db.snippets.find({
      filter,
    });

    let snippets = allSnippets;
    if (isPublic !== "true" && isPublic !== "false") {
      snippets = allSnippets.filter(
        (snippet) => snippet.user_id === user.id || snippet.is_public === true
      );
    }

    snippets.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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

    const { title, description, code, language, is_public = false } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (!language) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

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
