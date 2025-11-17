import { NextResponse } from "next/server"

export const setTokenCookie = (token: string, res: NextResponse) => {
    res.cookies.set("token", token, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/"
    })

    res.cookies.set("is_authenticated", "true", {
        maxAge: 60 * 60 * 24,
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })

    return res
}