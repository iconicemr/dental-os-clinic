import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const { staff_code, full_name, role, temp_password, phone } = await req.json();

    if (!staff_code || !full_name || !role || !temp_password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const allowedRoles = ["admin", "doctor", "assistant", "receptionist", "intake"] as const;
    if (!allowedRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Client scoped to the caller to read their user and role
    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const { data: authUserData, error: authUserErr } = await callerClient.auth.getUser();
    if (authUserErr || !authUserData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Verify the caller is admin
    const { data: callerProfile, error: profileErr } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("user_id", authUserData.user.id)
      .single();

    if (profileErr || !callerProfile || callerProfile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: admin only" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = `${staff_code}@iconic.local`;

    const { data: created, error: createErr } = await serviceClient.auth.admin.createUser({
      email,
      password: temp_password,
      email_confirm: true,
    });

    if (createErr || !created?.user?.id) {
      console.error("createUser error", createErr);
      return new Response(
        JSON.stringify({ error: createErr?.message || "Failed to create auth user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newUserId = created.user.id;

    const { data: profile, error: insertErr } = await serviceClient
      .from("profiles")
      .insert({
        user_id: newUserId,
        staff_code,
        full_name,
        role,
        phone: phone || null,
        is_active: true,
        must_change_password: true,
        last_password_reset_at: new Date().toISOString(),
      })
      .select("user_id, staff_code, full_name, role, phone, is_active, must_change_password, created_at")
      .single();

    if (insertErr) {
      console.error("insert profile error", insertErr);
      return new Response(
        JSON.stringify({ error: insertErr.message || "Failed to insert profile" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ user: created.user, profile }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("admin-create-user error", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});