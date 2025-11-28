import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    try {
        if (!token) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 401 })
        }

        const userToken = await verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId }, select: { id: true, name: true, email: true } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 401 })
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: err }, { status: 500 })
    }
}   