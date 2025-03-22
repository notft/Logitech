import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";


export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { username, email,password } = body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db`
          INSERT INTO USERS (username, email, password)
          VALUES (${username}, ${email}, ${hashedPassword});
        `;
        return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    } catch (error) {
      console.error("Error adding user:", error);
      return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
    }
  }
  