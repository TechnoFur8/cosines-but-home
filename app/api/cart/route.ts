import { generateToken } from "@/lib/token-cookie"
import { prisma } from "@/prisma/prisma-client"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

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
        //     return NextResponse.json({ message: "Пользователь не найден" }, { status: 401 })
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

        let cart = await prisma.cart.findUnique({ where: { sessionId: token.value } })

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    sessionId: token.value
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