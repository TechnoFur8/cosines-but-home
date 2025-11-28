import { NextResponse } from "next/server"

export const setTokenCookie = (token: string, res: NextResponse) => {
    res.cookies.set("token", token, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/"
    })

    return res
}