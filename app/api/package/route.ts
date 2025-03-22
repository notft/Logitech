import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const rows = await db`SELECT * FROM orders`;
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}