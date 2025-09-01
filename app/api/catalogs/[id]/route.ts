import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const searchParams = req.nextUrl.searchParams
    const { id } = await params
    const catalogId = Number(id)

    const limit = searchParams.get("limit") || "15"

    try {
        const product = await prisma.product.findMany({
            where: { catalogId },
            take: Number(limit),
            orderBy: { id: "desc" }
        })
        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const formData = await req.formData()
    const { id } = await params
    const catalogId = Number(id)

    if (!catalogId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    const name = formData.get("name") as string
    const img = formData.get("img") as File

    try {
        const catalog = await prisma.catalog.findUnique({ where: { id: catalogId } })

        if (!catalog) {
            return NextResponse.json({ message: "Такого каталога нет" }, { status: 404 })
        }

        const publicId = catalog.img.split("/").slice(-1).join("").split(".")[0]

        let imgUrl = catalog.img

        if (img) {
            const bytes = await img.arrayBuffer()
            const base64 = Buffer.from(bytes).toString("base64")
            const dataUrl = `data:${img.type};base64,${base64}`

            const uploaded = await cloudinary.uploader.upload(dataUrl, {
                public_id: publicId,
                overwrite: true,
                invalidate: true
            })

            imgUrl = uploaded.secure_url
        }

        const updated = await prisma.catalog.update({
            where: { id: catalogId },
            data: {
                name,
                img: imgUrl
            }
        })

        return NextResponse.json({ updated, message: "Каталог обновлен" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const catalogId = Number(id)

    if (!catalogId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        let catalogImg = await prisma.catalog.findUnique({ where: { id: catalogId }, select: { img: true } })

        if (catalogImg?.img) {
            const publicId = catalogImg.img.split("/").slice(-1).join("").split(".")[0]
            catalogImg = await cloudinary.uploader.destroy(publicId)
        }

        await prisma.catalog.delete({ where: { id: catalogId } })

        return NextResponse.json({ message: "Каталог удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}