import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/prisma-client"
import cloudinary from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams

    const limit = searchParams.get("limit") || "15"

    try {
        const products = await prisma.product.findMany({
            orderBy: { id: "desc" },
            take: Number(limit),
        })

        return NextResponse.json(products, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const images = formData.getAll("img") as File[]
    const name = formData.get("name") as string
    const price = formData.get("price") as string
    const discount = formData.get("discount") as string
    const compound = formData.get("compound") as string
    const warp = formData.get("warp") as string
    const hight = formData.get("hight") as string
    const hardness = formData.get("hardness") as string
    const size = formData.get("size") as string
    const description = formData.get("description") as string
    const from = formData.get("from") as string
    const catalogId = formData.get("catalogId") as string

    if (!name || !price || !discount || !compound || !warp || !hight || !hardness || !size || !description || !from) {
        return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
    }

    if (!images || images.length === 0) {
        return NextResponse.json({ message: "Не загружены изображения" }, { status: 400 })
    }


    try {
        const uploadPromises = images.map(async (file) => {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const base64 = buffer.toString("base64")
            const dataURL = `data:${file.type};base64,${base64}`

            return cloudinary.uploader.upload(dataURL)
        })

        const uploadRes = await Promise.all(uploadPromises)
        const uploadImg = uploadRes.map(res => res.secure_url)

        const product = await prisma.product.create({
            data: {
                img: uploadImg,
                name,
                price: parseFloat(price),
                discount: parseFloat(discount),
                compound,
                warp,
                hight: parseFloat(hight),
                hardness: parseFloat(hardness),
                size,
                description,
                from,
                catalogId: Number(catalogId)
            }
        })

        return NextResponse.json(product, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}