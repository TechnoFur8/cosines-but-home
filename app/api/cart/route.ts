import { createToken } from "@/lib/create-token"
import { prisma } from "@/prisma/prisma-client"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

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

        let cart = await prisma.cart.findUnique({ where: { sessionId: token.value } })

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    sessionId: token.value
                }
            })
        }

        const cartProduct = await prisma.cartProduct.findMany({ where: { cartId: cart.id }, orderBy: { id: "desc" } })

        return NextResponse.json({ cartProduct }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}