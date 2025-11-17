import { verefyToken } from "@/lib/token";
import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})

export async function GET(req: NextRequest) {

}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const { phone, address, delivery, pay, policy, email } = await req.json()

    try {
        if (!phone || !address || !delivery || !pay || !policy || !email) {
            return NextResponse.json({ message: "Неверные данные" }, { status: 400 })
        }

        if (policy === false) {
            return NextResponse.json({ message: "Пользователь откланил соглашение" }, { status: 400 })
        }

        if (!token) {
            return NextResponse.json({ message: "Токен не найден" }, { status: 401 })
        }

        const userToken = verefyToken(token.value)

        if (!userToken) {
            return NextResponse.json({ message: "Невалидный токен" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: userToken.userId } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь неайден" }, { status: 404 })
        }

        const cart = await prisma.cart.findUnique({ where: { userId: user.id } })

        if (!cart) {
            return NextResponse.json({ message: "Корзина неайдена" }, { status: 404 })
        }

        const cartItem = await prisma.cartProduct.findMany({ where: { cartId: cart.id } })

        if (!cartItem || cartItem.length === 0) {
            return NextResponse.json({ message: "Корзина пуста" }, { status: 400 })
        }

        const total = cartItem.reduce((acc, el) => acc + el.price, 0)

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    name: user.name,
                    email,
                    phone,
                    address,
                    delivery,
                    pay,
                    policy,
                    total,
                    userId: user.id,
                }
            })

            const orderItems = await tx.orderItem.createMany({
                data: cartItem.map(el => ({
                    quantity: el.quantity,
                    price: el.price,
                    size: el.size,
                    productName: el.name,
                    orderId: order.id,
                    productId: el.productId
                }))
            })

            await tx.cartProduct.deleteMany({
                where: { cartId: cart.id }
            })

            return { order, orderItems }
        })

        const fromClient = {
            from: email,
            to: process.env.GMAIL_MAIL,
            subject: `У вас новый заказ`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; background-color: #f5f5f7;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #d2d2d7;">
                        <h1 style="color: #1d1d1f; margin: 0; font-size: 24px; font-weight: 600;">Заказ №${result.order.id}</h1>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Информация о покупателе</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 8px 0; width: 120px; vertical-align: top;"><strong style="color: #86868b; font-weight: 500;">Имя:</strong></td>
                                <td style="padding: 8px 0;">${user.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Телефон:</strong></td>
                                <td style="padding: 8px 0;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Адрес:</strong></td>
                                <td style="padding: 8px 0;">${address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Доставка:</strong></td>
                                <td style="padding: 8px 0;">${delivery}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Оплата:</strong></td>
                                <td style="padding: 8px 0;">${pay}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Состав заказа</h2>
                        ${cartItem.map(el => `
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px; background-color: #fbfbfd;">
                            <!-- Изображения товара -->
                            <div style="margin-bottom: 15px; text-align: center;">
                                <img src="${el.img}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 6px; display: inline-block; margin: 0 10px 10px 0;"/>
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; width: 35%;"><strong style="color: #86868b; font-weight: 500;">Название:</strong></td>
                                    <td style="padding: 6px 0; font-weight: 500;">${el.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Размер:</strong></td>
                                    <td style="padding: 6px 0;">${el.size}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Кол-во:</strong></td>
                                    <td style="padding: 6px 0;">${el.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Цена:</strong></td>
                                    <td style="padding: 6px 0; color: #1d1d1f; font-weight: 600;">${result.order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</td>
                                </tr>
                            </table>
                        </div>
                        `).join("")}
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7; text-align: right;">
                        <span style="font-size: 18px; font-weight: 600; color: #1d1d1f;">Итого: ${result.order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div style="text-align: center; padding: 25px; color: #86868b; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a2a2a6;">© ${new Date().getFullYear()} Уют под ногами</p>
                    </div>
                </div>
                `,
        }

        const fromAdmin = {
            from: `Уют под ногами <${process.env.GMAIL_MAIL}>`,
            to: email,
            subject: "Спасибо за заказ",
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f; background-color: #f5f5f7;">
                    <div style="background-color: #ffffff; padding: 25px; text-align: center; border-bottom: 1px solid #d2d2d7;">
                        <h1 style="color: #1d1d1f; margin: 0; font-size: 24px; font-weight: 600;">Заказ №${result.order.id}</h1>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Информация о покупателе</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <tr>
                                <td style="padding: 8px 0; width: 120px; vertical-align: top;"><strong style="color: #86868b; font-weight: 500;">Имя:</strong></td>
                                <td style="padding: 8px 0;">${user.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Телефон:</strong></td>
                                <td style="padding: 8px 0;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Адрес:</strong></td>
                                <td style="padding: 8px 0;">${address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Доставка:</strong></td>
                                <td style="padding: 8px 0;">${delivery}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong style="color: #86868b; font-weight: 500;">Оплата:</strong></td>
                                <td style="padding: 8px 0;">${pay}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7;">
                        <h2 style="color: #1d1d1f; border-bottom: 1px solid #d2d2d7; padding-bottom: 12px; font-size: 18px; font-weight: 500;">Состав заказа</h2>
                        ${cartItem.map(el => `
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px; background-color: #fbfbfd;">
                            <!-- Изображения товара -->
                            <div style="margin-bottom: 15px; text-align: center;">
                                <img src="${el.img}" style="width: 120px; height: 120px; object-fit: contain; border-radius: 6px; display: inline-block; margin: 0 10px 10px 0;"/>
                            </div>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; width: 35%;"><strong style="color: #86868b; font-weight: 500;">Название:</strong></td>
                                    <td style="padding: 6px 0; font-weight: 500;">${el.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Размер:</strong></td>
                                    <td style="padding: 6px 0;">${el.size}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Кол-во:</strong></td>
                                    <td style="padding: 6px 0;">${el.quantity}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0;"><strong style="color: #86868b; font-weight: 500;">Цена:</strong></td>
                                    <td style="padding: 6px 0; color: #1d1d1f; font-weight: 600;">${result.order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</td>
                                </tr>
                            </table>
                        </div>
                        `).join("")}
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; margin: 15px 10px; border-radius: 12px; border: 1px solid #d2d2d7; text-align: right;">
                        <span style="font-size: 18px; font-weight: 600; color: #1d1d1f;">Итого: ${result.order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div style="text-align: center; padding: 25px; color: #86868b; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 0 0 10px 0;">Спасибо за ваш заказ!</p>
                        <p style="margin: 0;">Мы свяжемся с вами в ближайшее время.</p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #a2a2a6;">© ${new Date().getFullYear()} Уют под ногами</p>
                    </div>
                </div>
                `,
        }

        transporter.sendMail(fromClient, (err, info) => {
            if (err) {
                console.error(err)
            } else {
                console.log("Письмо отправлено: " + info.messageId)
            }

            transporter.sendMail(fromAdmin, (err, info) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Письмо отправлено: " + info.messageId)
                }
            })
        })

        return NextResponse.json({ message: "Заказ создан", order: result.order }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}