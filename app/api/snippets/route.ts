import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { db } from "@/lib/server/notdb";

function generateShortCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const snippets = await db.snippets.find({
      filter: {
        user_id: user.id,
      },
      offset: (page - 1) * limit,
      limit: limit,
      sort: "createdAt",
    });

    return NextResponse.json({
      snippets,
      pagination: {
        page,
        limit,
        total: await db.snippets.count({ filter: { user_id: user.id } }),
        totalPages: Math.ceil(
          (await db.snippets.count({ filter: { user_id: user.id } })) / limit
        ),
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

    let short_code = "";
    let exists = true;
    while (exists) {
      short_code = generateShortCode();
      const found = await db.snippets.find({ filter: { short_code } });
      exists = found.length > 0;
    }

    const snippet = await db.snippets.insert({
      title,
      description,
      code,
      language,
      is_public: Boolean(is_public),
      user_id: user.id,
      short_code,
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
