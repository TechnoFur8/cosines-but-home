import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const { id } = await params
    const productId = Number(id)
    const { ratingStar, description } = await req.json()

    try {
        if (!productId) {
            return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
        }

        if (!token) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 404 })
        }

        const userToken = verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 })
        }

        if (!ratingStar || ratingStar < 1 || ratingStar > 5) {
            return NextResponse.json({ message: "Неверный рейтинг" }, { status: 400 })
        }

        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        const rating = await prisma.rating.findFirst({ where: { userId: user.id, productId } })

        if (rating) {
            return NextResponse.json({ message: "Вы уже оставили отзыв" }, { status: 400 })
        }

        const createRating = await prisma.rating.create({
            data: {
                productId,
                name: user.name,
                rating: ratingStar,
                description,
                userId: user.id
            }
        })

        return NextResponse.json({ message: "Отзыв успешно создан", createRating }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        const product = await prisma.rating.findMany({ where: { productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const ratingId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    try {
        if (!ratingId) {
            return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
        }

        if (!token) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 404 })
        }

        const userToken = verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 })
        }

        if (user.role !== "ADMIN") {
            return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 })
        }

        const rating = await prisma.rating.findUnique({ where: { id: ratingId } })

        if (!rating) {
            return NextResponse.json({ message: "Такого отзыва нет" }, { status: 404 })
        }

        await prisma.rating.delete({ where: { id: rating.id } })

        return NextResponse.json({ message: "Отзыв удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}
