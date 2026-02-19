import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    console.log("📥 Revalidation request received");

    if (secret !== "supersecret") {
      console.error("❌ Invalid secret");
      return NextResponse.json(
        { message: "Invalid secret" },
        { status: 401 }
      );
    }

    revalidatePath("/", "layout");

    console.log("✅ Cache cleared");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    console.error("❌ Revalidation error:", error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
