import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { createToken } from "@/lib/token";
import { setTokenCookie } from "@/lib/token-cookie";

export async function POST(req: NextRequest) {
    const { name, email, password, repeatPassword } = await req.json()

    if (!name || !email || !password || !repeatPassword) {
        return NextResponse.json({ message: "Не все поля заполнены" }, { status: 400 })
    }

    if (password < 6) {
        return NextResponse.json({ message: "Пароль должен быть не менее 6 символов" }, { status: 400 })
    }
    
    if (password !== repeatPassword) {
        return NextResponse.json({ message: "Пароли не совпадают" }, { status: 400 })
    }

    try {
        const userEmail = await prisma.user.findUnique({ where: { email } })

        if (userEmail) {
            return NextResponse.json({ message: "Пользователь с таким email уже существует" }, { status: 400 })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const token = createToken({ userId: newUser.id, userEmail: newUser.email, userRole: newUser.role })

        const response = NextResponse.json({
            message: "Успешная регистрация",
            user: { id: newUser.id, email: newUser.email, role: newUser.role },
        }, { status: 200 })

        setTokenCookie(token, response)

        return response

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}