import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search")
    const limit = searchParams.get("limit") || "15"

    try {
        const products = await prisma.product.findMany({
            where: search ? {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            } : undefined,
            take: Number(limit),
            orderBy: { id: "desc" },
        })

        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error(err)
    }
}