import { NextResponse } from "next/server"

const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const setTokenCookie = (token: string, res: NextResponse) => {
    res.cookies.set("token", token, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",
        // secure: true,
        path: "/",
        domain: "192.168.0.151"
    })

    return res
}

export const generateTokenSessionId = (res: NextResponse) => {
    res.cookies.set("sessionId", generateToken(), {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",
        // secure: true,
        path: "/",
        domain: "192.168.0.151"
    })

    return res
}