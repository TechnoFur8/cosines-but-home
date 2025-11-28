import { prisma } from "@/prisma/prisma-client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        const product = await prisma.rating.findMany({ where: { productId }, orderBy: { createdAt: "desc" } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}