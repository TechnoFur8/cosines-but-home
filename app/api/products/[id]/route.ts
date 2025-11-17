import { deleteMultipleImg } from "@/lib/delete-img";
import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } })
        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json()
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")


    try {
        if (!token) {
            return NextResponse.json({ message: "Вы не авторизованы" }, { status: 401 })
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

        if (!productId) {
            return NextResponse.json({ message: "Непервильный ID" }, { status: 404 })
        }

        if (!body.name || !body.price || !body.discount || !body.compound || !body.warp || !body.hight || !body.hardness || !body.size || !body.description || !body.from) {
            return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
        }

        const product = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                img: body.img,
                name: body.name,
                price: body.price,
                discount: body.discount,
                compound: body.compound,
                warp: body.warp,
                hight: body.hight,
                hardness: body.hardness,
                size: body.size,
                description: body.description,
                from: body.from
            }

        })

        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    
    try {
        if (!token) {
            return NextResponse.json({ message: "Вы не авторизованы" }, { status: 401 })
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

        if (!productId) {
            return NextResponse.json({ message: "Непервильный ID" }, { status: 404 })
        }

        const productImg = await prisma.product.findUnique({ where: { id: productId }, select: { img: true } })

        if (productImg?.img) {
            await deleteMultipleImg(productImg.img)
        }

        await prisma.product.delete({ where: { id: productId } })

        return NextResponse.json({ message: "Продукт удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }

}