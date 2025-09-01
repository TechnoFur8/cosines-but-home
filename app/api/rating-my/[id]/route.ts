import { createToken } from "@/lib/create-token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    let token = cookieStore.get("ratingId")
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        if (!token) {
            const newToken = createToken()

            cookieStore.set("ratingId", newToken, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: true,
                secure: true
            })

            token = { name: "ratingId", value: newToken }
        }

        let rating = await prisma.rating.findUnique({ where: { ratingId: token.value, productId } })

        return NextResponse.json({ rating }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}