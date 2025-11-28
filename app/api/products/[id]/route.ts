import cloudinary from "@/lib/cloudinary";
import { deleteMultipleImg } from "@/lib/delete-img";
import { selectedSize } from "@/lib/selected-size";
import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { includes } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)

    if (!productId) {
        return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
    }

    try {
        const product = await prisma.product.findUnique({ where: { id: productId } })
        return NextResponse.json(product, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const formData = await req.formData()
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

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
    const deletedImages = formData.get("deletedImages") as string

    try {
        if (!productId) {
            return NextResponse.json({ message: "не верный ID" }, { status: 404 })
        }

        if (!token) {
            return NextResponse.json({ message: "Вы не авторизованы" }, { status: 401 })
        }

        const userToken = await verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 401 })
        }

        if (user.role !== "ADMIN") {
            return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 })
        }

        if (!name || !price || !discount || !compound || !warp || !hight || !hardness || !size || !description || !from || !catalogId) {
            return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
        }

        const product = await prisma.product.findUnique({ where: { id: productId }, select: { img: true, size: true } })

        if (!product) {
            return NextResponse.json({ message: "Такого продукта нет" }, { status: 404 })
        }

        let imageUrls = [...product.img]

        if (deletedImages) {
            const deletedImagesArray = JSON.parse(deletedImages) as string[]

            if (deletedImagesArray.length > 0) {
                try {
                    await deleteMultipleImg(deletedImagesArray)
                } catch (err) {
                    console.error("Ошибка при удалении файлов из Cloudinary:", err)
                    return NextResponse.json({ message: "Ошибка при удалении изображений" }, { status: 500 })
                }
            }

            imageUrls = imageUrls.filter(img => !deletedImagesArray.includes(img))
        }

        let newImgUrls: string[] = []
        if (images && images.length > 0) {
            try {
                const uploadPromises = images.map(async (file) => {
                    if (file.size > 0) {
                        const bytes = await file.arrayBuffer()
                        const buffer = Buffer.from(bytes)
                        const base64 = buffer.toString("base64")
                        const dataURL = `data:${file.type};base64,${base64}`

                        const result = await cloudinary.uploader.upload(dataURL, {
                            folder: 'products'
                        })
                        return result.public_id
                    }
                    return null
                })

                const uploadResults = await Promise.all(uploadPromises)
                newImgUrls = uploadResults.filter((result): result is string => result !== null)

            } catch (err) {
                console.error("Ошибка загрузки файлов в Cloudinary:", err)
                return NextResponse.json({ message: "Ошибка при загрузке новых изображений" }, { status: 500 })
            }
        }

        const allImages = [...imageUrls, ...newImgUrls]


        const productUpdate = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                img: allImages,
                name: name,
                price: Number(price),
                discount: Number(discount),
                compound: compound,
                warp: warp,
                hight: Number(hight),
                hardness: Number(hardness),
                size: size,
                description: description,
                from: from,
                catalogId: Number(catalogId)
            }

        })

        const updatePrice = selectedSize(productUpdate.size, productUpdate.price)
        const updateDiscount = selectedSize(productUpdate.size, productUpdate.discount)

        const productCart = await prisma.cartProduct.findMany({ where: { productId } })

        if (product.size !== productUpdate.size) {
            await prisma.cartProduct.deleteMany({ where: { productId, size: product.size } })
        }

        if (productCart.length > 0) {
            await prisma.cartProduct.updateMany({
                where: {
                    productId
                },
                data: {
                    name: productUpdate.name,
                    price: updatePrice,
                    discount: updateDiscount,
                }
            })
        }

        return NextResponse.json(productUpdate, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = Number(id)
    const cookieStore = await cookies()
    const token = cookieStore.get("token")


    try {
        if (!token) {
            return NextResponse.json({ message: "Вы не авторизованы" }, { status: 401 })
        }

        const userToken = await verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 401 })
        }

        if (user.role !== "ADMIN") {
            return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 })
        }

        if (!productId) {
            return NextResponse.json({ message: "Непервильный ID" }, { status: 404 })
        }

        const productImg = await prisma.product.findUnique({ where: { id: productId }, select: { img: true } })

        if (productImg?.img) {
            await deleteMultipleImg(productImg.img)
        }

        await prisma.product.delete({ where: { id: productId } })

        return NextResponse.json({ message: "Продукт удален" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }

}