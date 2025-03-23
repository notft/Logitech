import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not set in environment variables.");
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = req.cookies.get("type")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname !== "/auth/login" && pathname !== "/auth/register") {
      console.log("No token found, redirecting to login...");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const secretKey = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secretKey);
    console.log("Decoded Token:", payload);

    if (pathname === "/auth/login" || pathname === "/auth/register") {
      if (user === "admin") {
        return NextResponse.redirect(new URL("/government/dashboard", req.url));
      } else if (user === "company") {
        return NextResponse.redirect(new URL("/company", req.url));
      } else if (user === "driver") {
        return NextResponse.redirect(new URL("/driver", req.url));
      }
    }

    if (user === "admin" && (pathname === "/company" || pathname === "/driver")) {
      return NextResponse.redirect(new URL("/government/dashboard", req.url));
    }
    if (user === "company" && (pathname === "/government/dashboard" || pathname === "/driver")) {
      return NextResponse.redirect(new URL("/company", req.url));
    }
    if (user === "driver" && (pathname === "/government/dashboard" || pathname === "/company")) {
      return NextResponse.redirect(new URL("/driver", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Invalid token, redirecting to login...");
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("token"); 
    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/government",
    "/government/dashboard",
    "/company",
    "/driver",
  ],
};
