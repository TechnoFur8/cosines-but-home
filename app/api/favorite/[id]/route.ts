import { verefyToken } from "@/lib/token";
import { generateToken } from "@/lib/token-cookie";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    let token = cookieStore.get("sessionId")

    try {
        if (!productId) {
            return NextResponse.json({ message: "Неверный ID" }, { status: 400 })
        }

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

        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

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

        const favoriteItem = await prisma.favoriteProduct.findFirst({ where: { favoriteId: favorite.id, productId } })

        if (favoriteItem) {
            return NextResponse.json({ message: "Товар уже в избранном" }, { status: 400 })
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

        return NextResponse.json(favoriteProduct, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const favoriteProductId = Number(id)
    const cookieStore = await cookies()
    let token = cookieStore.get("sessionId")

    if (!favoriteProductId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 400 })
    }


    try {
        // if (!token) {
        //     return NextResponse.json({ message: "Токен не найден" }, { status: 404 })
        // }

        // const userToken = await verefyToken(token.value)

        // if (!userToken) {
        //     return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        // }

        // const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        // if (!user) {
        //     return NextResponse.json({ message: "Пользователь не найден" }, { status: 401 })
        // }

        const favorite = await prisma.favorite.findUnique({ where: { sessionId: token?.value } })

        if (!favorite) {
            return NextResponse.json({ message: "Избранное не найдено" }, { status: 404 })
        }

        const favoriteProduct = await prisma.favoriteProduct.findFirst({ where: { favoriteId: favorite.id, id: favoriteProductId } })

        if (!favoriteProduct) {
            return NextResponse.json({ message: "Товара нет в избранном" }, { status: 404 })
        }

        await prisma.favoriteProduct.delete({ where: { id: favoriteProduct.id } })

        return NextResponse.json({ message: "Товар удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}