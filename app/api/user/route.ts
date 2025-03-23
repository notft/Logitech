import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
const { searchParams } = new URL(request.url);
const ussrID = searchParams.get('ussrID') as string | null;

if (!ussrID) {
    throw new Error("Missing or invalid 'ussrID' parameter");
}

const rows = await db`SELECT * FROM USERS WHERE id=${ussrID}`;
const user = rows[0];
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}