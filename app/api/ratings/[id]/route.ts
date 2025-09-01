import cloudinary from "@/lib/cloudinary";
import { createToken } from "@/lib/create-token";
import { deleteMultipleImg } from "@/lib/delete-img";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)
    const formData = await req.formData()
    const cookieStore = await cookies()
    let token = cookieStore.get("ratingId")

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    const img = formData.getAll("img") as File[]
    const name = formData.get("name") as string
    const rating = formData.get("rating") as string
    const description = formData.get("description") as string

    if (!name || !rating || !description) {
        return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
    }

    if (!img || img.length === 0) {
        return NextResponse.json({ message: "Не загружены изображения" }, { status: 400 })
    }

    if (img.length > 10) {
        return NextResponse.json({ message: "Слишком много изображений" }, { status: 400 })
    }

    if (Number(rating) > 5 || Number(rating) < 1) {
        return NextResponse.json({ message: "Неверный рейтинг" }, { status: 400 })
    }

    try {

        if (!token) {
            const newToken = createToken()

            cookieStore.set("ratingId", newToken, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: true,
                secure: true
            })

            token = { name: "ratingId", value: newToken }
        }

        const rating = await prisma.rating.findUnique({ where: { ratingId: token.value, productId } })

        if (rating) {
            return NextResponse.json({ message: "Вы уже оставили отзыв" }, { status: 400 })
        }

        const uploadPromises = img.map(async (file) => {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const base64 = buffer.toString("base64")
            const dataURL = `data:${file.type};base64,${base64}`

            return cloudinary.uploader.upload(dataURL)
        })

        const uploadRes = await Promise.all(uploadPromises)
        const uploadImg = uploadRes.map(res => res.secure_url)


        const createRating = await prisma.rating.create({
            data: {
                productId,
                name,
                rating: Number(rating),
                description,
                img: uploadImg,
                ratingId: token.value
            }
        })

        return NextResponse.json(createRating, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    try {
        const product = await prisma.rating.findMany({ where: { productId } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        // if (product.length === 0) {
        //     return NextResponse.json({ message: "Отзывов нет" }, { status: 404 })
        // }

        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const ratingId = Number(id)
    const formData = await req.formData()

    if (!ratingId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    const img = formData.getAll("img") as File[]
    const name = formData.get("name") as string
    const rating = formData.get("rating") as string
    const description = formData.get("description") as string

    if (!name || !rating || !description) {
        return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
    }

    if (!img || img.length === 0) {
        return NextResponse.json({ message: "Не загружены изображения" }, { status: 400 })
    }

    if (img.length > 10) {
        return NextResponse.json({ message: "Слишком много изображений" }, { status: 400 })
    }

    if (Number(rating) > 5 || Number(rating) < 1) {
        return NextResponse.json({ message: "Неверный рейтинг" }, { status: 400 })
    }

    try {
        const rating = await prisma.rating.findUnique({ where: { id: ratingId } })

        if (!rating) {
            return NextResponse.json({ message: "Такого отзыва нет" }, { status: 404 })
        }

        const publicId = rating.img.map(el => el.split("/").slice(-1).join("").split(".")[0])

        let imgUrl = rating.img

        if (img && img.length > 0) {
            const uploadPromises = img.map(async (file, i) => {
                const bytes = await file.arrayBuffer()
                const base64 = Buffer.from(bytes).toString("base64")
                const dataUrl = `data:${file.type};base64,${base64}`

                const uploaded = await cloudinary.uploader.upload(dataUrl, {
                    public_id: publicId[i],
                    overwrite: true,
                    invalidate: true
                })

                return uploaded.secure_url
            })

            const uploadedUrls = await Promise.all(uploadPromises)
            imgUrl = uploadedUrls
        }

        const updateRating = await prisma.rating.update({
            where: { id: ratingId },
            data: {
                name,
                rating: Number(rating),
                description,
                img: imgUrl
            }
        })

        return NextResponse.json(updateRating, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const ratingId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("ratingId")

    if (!ratingId) {
        return NextResponse.json({ message: "Неверный ID" }, { status: 404 })
    }

    if (!token) {
        return NextResponse.json({ message: "Не ваш отзыв" }, { status: 404 })
    }

    try {
        const ratingImg = await prisma.rating.findUnique({ where: { ratingId: token.value }, select: { img: true } })

        if (ratingImg?.img) {
            await deleteMultipleImg(ratingImg.img)
        }

        await prisma.rating.delete({ where: { id: ratingId } })

        return NextResponse.json({ message: "Отзыв удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}
