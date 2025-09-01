import { prisma } from "@/prisma/prisma-client"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const products = await prisma.product.findMany({ orderBy: { totalBought: "desc" }, take: 5 })
        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}