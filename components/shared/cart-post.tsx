"use client"

import { usePostCartMutation } from "@/store/apiSlice"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"
import { useCart } from "../hooks/use-cart"

interface Props {
    productId: number
    size: string
}

export const CartPost = ({ productId, size }: Props) => {
    const [postCart, { isLoading }] = usePostCartMutation()
    const check = useCart({ productId, size })

    const handleClickCartPost = async (productId: number, size: string) => {
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