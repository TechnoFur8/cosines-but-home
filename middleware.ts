import { NextRequest, NextResponse } from "next/server";
import { verefyToken } from "./lib/token";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")

    const { pathname } = req.nextUrl

    const publicPaths = ["/cart", "/favorite", "/profil"]

    if (publicPaths.includes(pathname) && !token) {
        return NextResponse.rewrite(new URL("/profil/registration", req.url))
    }

    if (pathname.startsWith("/admin-panel")) {
        if (!token) {
            return NextResponse.rewrite(new URL("/404", req.url))
        }

        const userToken = await verefyToken(token.value)

        if (!userToken) {
            return NextResponse.rewrite(new URL("/404", req.url))
        }

        if (userToken.userRole !== "ADMIN") {
            return NextResponse.rewrite(new URL("/404", req.url))
        }
    }

    return NextResponse.next()
}
