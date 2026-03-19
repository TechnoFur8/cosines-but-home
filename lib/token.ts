import jwt from "jsonwebtoken"
import { jwtVerify } from 'jose'

interface User {
    userId: number,
    userEmail: string,
    userRole: string
}

export const createToken = ({ userId, userEmail, userRole }: User) => {
    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined")
        }

        const token = jwt.sign({ userId, userEmail, userRole }, process.env.SECRET_KEY, {
            expiresIn: "24h"
        })

        return token
    } catch (err) {
        console.log(err)
        throw new Error("Не удалось создать токен")
    }
}

export const verefyToken = async (token: string): Promise<User | null> => {
    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined")
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const { payload } = await jwtVerify(token, secret)

        return payload as unknown as User
    } catch (err) {
        console.error(err)
        return null
    }
}