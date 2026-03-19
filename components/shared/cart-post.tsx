"use client"

import { usePostCartMutation } from "@/store/apiSlice"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"
import { useCart } from "../hooks/use-cart"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface Props {
    productId: number
    size: string
}

export const CartPost = ({ productId, size }: Props) => {
    const [postCart, { isLoading, error }] = usePostCartMutation()
    const check = useCart({ productId, size })
    const router = useRouter()

    console.log(error);

    useEffect(() => {
        console.log(error);
        if (error) {
            if ("status" in error && error.status === 401) {
                return router.push("/profil/registration")
            }
        }
    }, [error])

    const handleClickCartPost = async (productId: number, size: string) => {
        try {
            await postCart({ id: productId, size }).unwrap()
            toast.success("Товар добавлен в корзину")
        } catch (err) {
            if (size.length === 0) {
                return toast("Выберите размер", { icon: "❗" })
            }

            if (check) {
                return toast("Товар уже в корзине", { icon: "❗" })
            }
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <Button className={"cursor-pointer w-full sm:w-45"} disabled={isLoading} onClick={() => handleClickCartPost(productId, size)}>{isLoading ? <><LoaderCircle className={"animate-spin"} /> Добовляем в корзину </> : "В корзину"}</Button>
    )
}