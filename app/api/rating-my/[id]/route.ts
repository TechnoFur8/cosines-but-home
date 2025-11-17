import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
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

        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        const rating = await prisma.rating.findFirst({ where: { userId: user.id, productId } })

        if (!rating) {
            return NextResponse.json({ message: "Рейтинг не найден" }, { status: 404 })
        }

        return NextResponse.json({ rating }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const { id } = await params
    const myRatingId = Number(id)
    const { ratingStar, description } = await req.json()


    try {
        if (!myRatingId) {
            return NextResponse.json({ message: "Неверный ID" }, { status: 400 })
        }

        if (ratingStar > 5 || ratingStar < 1 || !ratingStar) {
            return NextResponse.json({ message: "Неверный рейтинг" }, { status: 400 })
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
            return NextResponse.json({ message: "Пользователь неайден" }, { status: 404 })
        }

        const rating = await prisma.rating.findUnique({ where: { userId: user.id, id: myRatingId } })

        if (!rating) {
            return NextResponse.json({ message: "Рейтинг не найден" }, { status: 404 })
        }

        const updateRating = await prisma.rating.update({
            where: { id: myRatingId },
            data: {
                name: user.name,
                rating: ratingStar,
                description,
                productId: rating.productId,
                userId: user.id
            }
        })

        return NextResponse.json({ message: "Товар был обновлен", updateRating }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const { id } = await params
    const ratingId = Number(id)

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

        const rating = await prisma.rating.findUnique({ where: { id: ratingId, userId: user.id } })

        if (!rating) {
            return NextResponse.json({ message: "Рейтинг не найден" }, { status: 404 })
        }

        await prisma.rating.delete({ where: { id: rating.id } })

        return NextResponse.json({ message: "Рейтинг удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}