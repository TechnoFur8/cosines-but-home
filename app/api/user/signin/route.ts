import { createToken } from "@/lib/token";
import { setTokenCookie } from "@/lib/token-cookie";
import { prisma } from "@/prisma/prisma-client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    if (!email || !password) {
        return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email } })

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 400 })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return NextResponse.json({ message: "Неверный пароль или email" }, { status: 401 })
        }

        const token = createToken({ userId: user.id, userEmail: user.email, userRole: user.role })

        const response = NextResponse.json({
            message: "Успешная авторизация",
            user: { id: user.id, email: user.email, role: user.role }
        })

        setTokenCookie(token, response)

        return response
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 })
    }
}