import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const catalog = await prisma.catalog.findMany()
        return NextResponse.json(catalog, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const images = formData.get("img") as File
    const name = formData.get("name") as string

    if (!name || !images) {
        return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
    }

    try {
        const arrayBuffer = await images.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64 = buffer.toString("base64")
        const dataUrl = `data:${images.type};base64,${base64}`

        const uploaded = await cloudinary.uploader.upload(dataUrl)
        
        const catalog = await prisma.catalog.create({
            data: {
                img: uploaded.secure_url,
                name,
            }
        })

        return NextResponse.json(catalog, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}