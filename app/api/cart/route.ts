import { verefyToken } from "@/lib/token"
import { prisma } from "@/prisma/prisma-client"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

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
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 })
        }

        let cart = await prisma.cart.findUnique({ where: { userId: user.id } })

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: user.id
                }
            })
        }

        const cartProducts = await prisma.cartProduct.findMany({ where: { cartId: cart.id }, orderBy: { createdAt: "desc" } })

        return NextResponse.json({ cartProducts }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}