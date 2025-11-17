import jwt from "jsonwebtoken"

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

export const verefyToken = (token: string): User | null => {
    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined")
        }

        return jwt.verify(token, process.env.SECRET_KEY) as User
    } catch (err) {
        console.error(err)
        return null
    }
}