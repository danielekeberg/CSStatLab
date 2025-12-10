import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = cookies();
    const session = (await cookieStore).get("session");
    const loggedIn = !!session;
    return NextResponse.json({loggedIn})
}