"use client"

import { usePostCartMutation } from "@/store/apiSlice"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"
import { useCart } from "../hooks/use-cart"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface Props {
    productId: number
    size: string
}

export const CartPost = ({ productId, size }: Props) => {
    const [postCart, { isLoading, error }] = usePostCartMutation()
    const check = useCart({ productId, size })
    const token = Cookies.get("token")
    const router = useRouter()

    useEffect(() => {
        if (error) {
            if ("status" in error && error.status === 401) {
                return router.push("/profil/registration")
            }
        }
    }, [error])

    const handleClickCartPost = async (productId: number, size: string) => {
        if (!token) {
            return router.push("/profil/registration")
        }

        if (size.length === 0) {
            return toast("Выберите размер", { icon: "❗" })
        }

        if (check) {
            return toast("Товар уже в корзине", { icon: "❗" })
        }

        try {
            await postCart({ id: productId, size }).unwrap()
            toast.success("Товар добавлен в корзину")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <Button className={"cursor-pointer"} disabled={isLoading} onClick={() => handleClickCartPost(productId, size)}>{isLoading ? <> Добовляем в корзину <LoaderCircle className={"animate-spin"} /></> : "В корзину"}</Button>
    )
}