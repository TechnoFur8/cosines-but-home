import { verefyToken } from "@/lib/token";
import { generateToken } from "@/lib/token-cookie";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies()
    let token = cookieStore.get("sessionId")

    try {
        // if (!token) {
        //     return NextResponse.json({ message: "Токен не найден" }, { status: 401 })
        // }

        // const userToken = await verefyToken(token.value)

        // if (!userToken) {
        //     return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        // }

        // const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        // if (!user) {
        //     return NextResponse.json({ message: "Пользователь неайден" }, { status: 401 })
        // }

        if (!token) {
            const newToken = generateToken()

            cookieStore.set("sessionId", newToken, {
                maxAge: 365 * 24 * 60 * 60,
                httpOnly: true,
                sameSite: "strict",
                // secure: true,
                path: "/",
                domain: "192.168.0.151"
            })

            token = { name: "sessionId", value: newToken }
        }

        let favorite = await prisma.favorite.findUnique({ where: { sessionId: token.value } })

        if (!favorite) {
            favorite = await prisma.favorite.create({
                data: {
                    sessionId: token.value
                }
            })
        }

        const favoriteProduct = await prisma.favoriteProduct.findMany({ where: { favoriteId: favorite.id }, orderBy: { createdAt: "desc" } })

        return NextResponse.json({ favoriteProduct }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}