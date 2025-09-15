import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const { user_id, temp_password } = await req.json();

    if (!user_id || !temp_password) {
      return new Response(JSON.stringify({ error: "Missing user_id or temp_password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Caller client (for auth user)
    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const { data: authUserData, error: authUserErr } = await callerClient.auth.getUser();
    if (authUserErr || !authUserData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Ensure caller is admin
    const { data: callerProfile, error: profileErr } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("user_id", authUserData.user.id)
      .single();

    if (profileErr || !callerProfile || callerProfile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: updated, error: updateErr } = await serviceClient.auth.admin.updateUserById(user_id, {
      password: temp_password,
      email_confirm: true,
    });

    if (updateErr) {
      console.error("updateUserById error", updateErr);
      return new Response(JSON.stringify({ error: updateErr.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark profile to force password change on next login
    const { error: profileUpdateErr } = await serviceClient
      .from("profiles")
      .update({ must_change_password: true, last_password_reset_at: new Date().toISOString() })
      .eq("user_id", user_id);

    if (profileUpdateErr) {
      console.error("update profile error", profileUpdateErr);
    }

    return new Response(JSON.stringify({ user: updated.user }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-reset-password error", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});