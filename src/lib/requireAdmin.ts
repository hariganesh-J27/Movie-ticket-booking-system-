import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return { session: null, response: NextResponse.json({ success: false, message: "Sign in required" }, { status: 401 }) };
  }

  if (!isAdminEmail(session.user.email)) {
    return {
      session: null,
      response: NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 }),
    };
  }

  return { session, response: null };
}
