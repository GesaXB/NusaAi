import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If it's a signup confirmation, redirect to confirmed page
      if (type === "signup" || (!next && !type)) {
        return NextResponse.redirect(`${origin}/auth/confirmed`);
      }
      // If it's a password recovery, redirect to reset password page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      // Otherwise redirect to the specified next page or dashboard
      return NextResponse.redirect(`${origin}${next ?? "/dashboard"}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
