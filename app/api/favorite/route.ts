import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    try {
        if (!token) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 401 })
        }

        const userToken = verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь неайден" }, { status: 404 })
        }

        let favorite = await prisma.favorite.findUnique({ where: { userId: user.id } })

        if (!favorite) {
            favorite = await prisma.favorite.create({
                data: {
                    userId: user.id
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