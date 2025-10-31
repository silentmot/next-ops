import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = {
      userId,
      isAuthenticated: true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(session);
  } catch (_error) {
    return NextResponse.json(
      { message: "Session validation failed" },
      { status: 500 },
    );
  }
}
