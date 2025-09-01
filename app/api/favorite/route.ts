import { createToken } from "@/lib/create-token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies()
    let token = cookieStore.get("sessionId")

    try {
        if (!token) {
            const newToken = createToken()

            cookieStore.set("sessionId", newToken, {
                maxAge: 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: true
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

        const favoriteProduct = await prisma.favoriteProduct.findMany({ where: { favoriteId: favorite.id }, orderBy: { id: "desc" } })

        return NextResponse.json({ favoriteProduct }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}