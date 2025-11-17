import cloudinary from "@/lib/cloudinary";
import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
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
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const images = formData.get("img") as File
    const name = formData.get("name") as string

    
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

        if (!name || !images) {
            return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
        }

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