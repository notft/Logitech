import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!req) {
      throw new Error("Request body is null");
    }

    const body = await req.json();
    const { name, startLocation, destination, type } = body;

    if (!name || !startLocation || !destination || !type) {
      throw new Error("Name, startLocation, destination, type are required");
    }

    await db`
      INSERT INTO orders (name, start_location, destination, type) 
      VALUES (${name}, ${startLocation}, ${destination}, ${type});
    `;

    return NextResponse.json({ message: "Added successfully" }, { status: 201 });
  } catch (e) {
    console.error("❌ Error inserting order:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
