import { verifyPassword } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const {username, password } = await req.json();
    const supabase = createSupabaseServerClient();

    const { data: user } = await supabase
        .from("user")
        .select("id, password_hash")
        .eq("username", username)
        .single();

    if(!user) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(user.password_hash, password);
    if(!isValid) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    (await cookies()).set("session", user.id, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });

    return Response.json({ success: true })
}