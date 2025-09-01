import { createToken } from "@/lib/create-token";
import { selectedSize } from "@/lib/selected-size";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json()
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    let token = cookieStore.get("sessionId")

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

        return NextResponse.json({ cartProduct }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        await prisma.cartProduct.delete({ where: { id: productId } })
        return NextResponse.json({ message: "Продукт удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json()
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        const cart = await prisma.cartProduct.findUnique({ where: { id: productId } })

        if (!cart) {
            return NextResponse.json({ message: "Такого продукта в корзине нет" }, { status: 404 })
        }

        const product = await prisma.product.findUnique({ where: { id: cart.productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        if (body.quantity < 1) {
            await prisma.cartProduct.delete({ where: { id: productId } })
            return NextResponse.json({ message: "Продукт удален" }, { status: 200 })
        }

        const cartProduct = await prisma.cartProduct.update({
            where: {
                id: productId
            },
            data: {
                quantity: body.quantity,
                price: product.price * body.quantity,
                discount: product.discount * body.quantity
            }
        })

        return NextResponse.json(cartProduct, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}