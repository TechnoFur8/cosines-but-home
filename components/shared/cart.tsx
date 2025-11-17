"use client"

import { useGetCartQuery } from "@/store/apiSlice"
import { CldImage } from "next-cloudinary"
import { CartDelete } from "./cart-delete"
import { CartPut } from "./cart-put"
import { Frown } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export const Cart = () => {
    const { data, isLoading, isError, error } = useGetCartQuery()
    const router = useRouter()

    useEffect(() => {
        if (error) {
            if ("status" in error && error.status === 401) {
                return router.push("/profil/registration")
            }
        }
    }, [error])

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки корзины</h1>

    return (
        <>
            {data.cartProducts.length > 0 ?
                <div className={"space-y-6"}>
                    {data.cartProducts.map(el =>
                        <div key={el.id} className={"flex justify-between items-center"}>
                            <div className={"flex items-center gap-x-4"}>
                                <CldImage width={70} height={70} src={el.img} alt={el.name} className={"object-cover w-[70px] h-[70px]"} />
                                <div className={"flex flex-col"}>
                                    <span className={"font-medium"}>{el.name}</span>
                                    <div className={"flex items-center gap-x-2"}>
                                        <span className={"text-[#737373] text-sm"}>Количество: </span>
                                        <CartPut productId={el.id} quantity={el.quantity} />
                                    </div>
                                    <span className={"text-[#737373] text-sm"}>Размер: {el.size}</span>
                                </div>
                            </div>
                            <div className={"flex items-center gap-x-3"}>
                                <div className={"flex flex-col items-center"}>
                                    <span>{el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                    <span className={"line-through text-[#737373] text-sm"}>{el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                </div>
                                <CartDelete id={el.id} />
                            </div>
                        </div>
                    )}
                    <div className={"flex flex-col space-y-3"}>
                        <span className={"text-[#737373] line-through"}>Скидка: {data.cartProducts.reduce((acc, el) => acc + el.discount, 0).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                        <span className={"text-sm text-[#737373]"}>Итого: {data.cartProducts.reduce((acc, el) => acc + el.price, 0).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                </div>
                :
                <div className={"flex flex-col items-center gap-y-3"}>
                    <h1 className={"text-4xl text-[#737373] font-semibold text-center"}>К сожелению корзина пуста</h1>
                    <Frown size={50} color={"#737373"} />
                </div>
            }
        </>
    )
}