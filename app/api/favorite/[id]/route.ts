import { createToken } from "@/lib/create-token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    let token = cookieStore.get("sessionId")

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

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

        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        let favorite = await prisma.favorite.findUnique({ where: { sessionId: token.value } })

        if (!favorite) {
            favorite = await prisma.favorite.create({
                data: {
                    sessionId: token.value
                }
            })
        }

        const favoriteItem = await prisma.favoriteProduct.findFirst({ where: { favoriteId: favorite.id, productId } })

        if (favoriteItem) {
            return NextResponse.json({ message: "Такой продукт уже есть в избранном" }, { status: 400 })
        }

        const favoriteProduct = await prisma.favoriteProduct.create({
            data: {
                img: product.img[0],
                name: product.name,
                price: product.price,
                discount: product.discount,
                size: product.size,
                productId,
                favoriteId: favorite.id
            }
        })

        return NextResponse.json(favoriteProduct, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("sessionId")

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    if (!token) {
        return NextResponse.json({ message: "Токен не найден" }, { status: 404 })
    }

    try {
        const favoriteItem = await prisma.favoriteProduct.findFirst({ where: { productId: productId } })

        if (!favoriteItem) {
            return NextResponse.json({ message: "Такого продукта нет в избранном" }, { status: 404 })
        }

        const session = await prisma.favorite.findUnique({ where: { sessionId: token.value } })

        if (!session) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 404 })
        }

        await prisma.favoriteProduct.deleteMany({ where: { productId: favoriteItem.productId, favoriteId: session.id} })
        return NextResponse.json("Товар удален", { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}