import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")

    const { pathname } = req.nextUrl

    const publicPaths = ["/cart", "/favorite"]

    if (publicPaths.includes(pathname) && !token) {
        return NextResponse.rewrite(new URL("/profil/registration", req.url))
    }

    return NextResponse.next()
}