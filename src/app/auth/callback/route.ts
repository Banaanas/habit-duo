import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { appNavLinks } from "@/data/app-data";
import { createSupabaseServerClient } from "@/lib/supabase/clients/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? appNavLinks.home.href;

  if (code) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Clear cache so user sees fresh authenticated state
      revalidatePath(appNavLinks.home.href, "layout");
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
}
