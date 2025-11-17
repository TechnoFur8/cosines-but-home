import { verefyToken } from "@/lib/token";
import { selectedSize } from "@/lib/selected-size";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json()
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    
    try {
        if (!productId) {
            return NextResponse.json({ message: "Неверный ID" }, { status: 400 })
        }

        if (!body.size) {
            return NextResponse.json({ message: "Выберите размер" }, { status: 400 })
        }

        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        if (!token) {
            return NextResponse.json({ message: "Не авторизован" }, { status: 401 })
        }

        const userToken = verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 403 })
        }

        let cart = await prisma.cart.findUnique({ where: { userId: user.id } })

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: user.id
                }
            })
        }

        const cartItem = await prisma.cartProduct.findFirst({ where: { cartId: cart.id, productId, size: body.size } })

        if (cartItem) {
            return NextResponse.json({ message: "Такой продукт с таким размером уже есть в корзине" }, { status: 400 })
        }

        const totalPrice = selectedSize(body.size, product.price)
        const totalDiscounPrice = selectedSize(body.size, product.discount)

        const cartProduct = await prisma.cartProduct.create({
            data: {
                img: product.img[0],
                name: product.name,
                price: totalPrice,
                discount: totalDiscounPrice,
                size: body.size,
                productId: productId,
                quantity: 1,
                cartId: cart.id,
            }
        })

        return NextResponse.json({ message: "Продукт добавлен в корзину", cartProduct }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cartProductId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    if (!cartProductId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 400 })
    }

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

        const cart = await prisma.cart.findUnique({ where: { userId: user.id } })

        if (!cart) {
            return NextResponse.json({ message: "Корзина не найдена" }, { status: 404 })
        }

        const cartProduct = await prisma.cartProduct.findFirst({ where: { cartId: cart.id, id: cartProductId } })

        if (!cartProduct) {
            return NextResponse.json({ message: "Такого продукта нет в корзине" }, { status: 404 })
        }

        await prisma.cartProduct.deleteMany({ where: { id: cartProduct.id } })

        return NextResponse.json({ message: "Продукт удален из корзины" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json()
    const { id } = await params
    const cartProductId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    if (!cartProductId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        if (!token) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 404 })
        }

        const userToken = verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 403 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 })
        }

        const cart = await prisma.cart.findUnique({ where: { userId: user.id } })

        if (!cart) {
            return NextResponse.json({ message: "Корзина ненайдена" }, { status: 404 })
        }

        const cartProduct = await prisma.cartProduct.findFirst({ where: { cartId: cart.id, id: cartProductId } })

        if (!cartProduct) {
            return NextResponse.json({ message: "Такого продукта нет в корзине" }, { status: 404 })
        }

        const product = await prisma.product.findUnique({ where: { id: cartProduct.productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        if (body.quantity < 1) {
            await prisma.cartProduct.deleteMany({ where: { id: cartProductId } })
            return NextResponse.json({ message: "Продукт удален" }, { status: 200 })
        }

        const totalPrice = selectedSize(cartProduct.size, product.price) * body.quantity
        const totalDiscounPrice = selectedSize(cartProduct.size, product.discount) * body.quantity

        const cartProductUpdate = await prisma.cartProduct.update({
            where: {
                id: cartProductId,
                cartId: cart.id
            },
            data: {
                quantity: body.quantity,
                price: totalPrice,
                discount: totalDiscounPrice
            }
        })

        return NextResponse.json(cartProductUpdate, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}