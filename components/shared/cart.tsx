"use client"

import { useGetCartQuery } from "@/store/apiSlice"
import { CldImage } from "next-cloudinary"
import { CartDelete } from "./cart-delete"
import { CartPut } from "./cart-put"
import { Frown } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OrderPost } from "./order-post"

export const Cart = () => {
    const { data, isLoading, isError, refetch } = useGetCartQuery()

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки корзины</h1>

    const totalDiscount = data.cartProducts.reduce((acc, el) => acc + el.discount, 0)
    const totalPrice = data.cartProducts.reduce((acc, el) => acc + el.price, 0)

    return (
        <>
            {data.cartProducts.length > 0 ?
                <div className={"flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8"}>
                    <div className={"flex-1 lg:pr-6 space-y-4"}>
                        {data.cartProducts.map(el =>
                            <div 
                                key={el.id} 
                                className={
                                    "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 sm:p-5 " +
                                    "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                }
                            >
                                <div className={"flex items-start sm:items-center gap-4 flex-1 min-w-0"}>
                                    <CldImage 
                                        width={100} 
                                        height={100} 
                                        src={el.img} 
                                        alt={el.name} 
                                        className={"object-cover w-20 h-20 sm:w-24 sm:h-24 rounded-md flex-shrink-0"} 
                                    />
                                    <div className={"flex flex-col gap-2 min-w-0 flex-1"}>
                                        <span className={"font-semibold text-base sm:text-lg break-words"}>{el.name}</span>
                                        <div className={"flex flex-wrap items-center gap-2"}>
                                            <span className={"text-[#737373] text-sm"}>Количество:</span>
                                            <CartPut productId={el.id} quantity={el.quantity} />
                                        </div>
                                        <span className={"text-[#737373] text-sm"}>Размер: {el.size}</span>
                                    </div>
                                </div>
                                <div className={"flex items-center justify-between sm:justify-end gap-3 sm:gap-4"}>
                                    <div className={"flex flex-col items-end"}>
                                        <span className={"font-semibold text-lg sm:text-xl"}>
                                            {el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                        </span>
                                        {el.discount > 0 && (
                                            <span className={"line-through text-[#737373] text-sm"}>
                                                {el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                            </span>
                                        )}
                                    </div>
                                    <CartDelete id={el.id} />
                                </div>
                            </div>
                        )}
                        <div className={
                            "flex flex-col gap-3 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 mt-6"
                        }>
                            {totalDiscount > 0 && (
                                <div className={"flex justify-between items-center"}>
                                    <span className={"text-[#737373] text-sm sm:text-base"}>Скидка:</span>
                                    <span className={"text-[#737373] line-through text-sm sm:text-base"}>
                                        {totalDiscount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                    </span>
                                </div>
                            )}
                            <div className={"flex justify-between items-center pt-2 border-t border-gray-300"}>
                                <span className={"font-semibold text-base sm:text-lg"}>Итого:</span>
                                <span className={"font-bold text-lg sm:text-xl text-gray-900"}>
                                    {totalPrice.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={"w-full lg:max-w-[400px] lg:w-full"}>
                        <div className={"sm:sticky sm:top-5"}>
                            <div className={
                                "bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 " +
                                "hidden sm:block"
                            }>
                                <h3 className={"text-xl sm:text-2xl font-semibold mb-4"}>Оформить заказ</h3>
                                <OrderPost refetch={refetch} />
                            </div>
                        </div>
                    </div>
                    <div className={
                        "sm:hidden fixed bottom-15 left-0 right-0 z-50  px-4"
                    }>
                        <OrderPost refetch={refetch} />
                    </div>
                    <div className={"sm:hidden h-20"}></div>
                </div>
                :
                <div className={"flex flex-col items-center justify-center gap-6 py-12 sm:py-16"}>
                    <Frown size={64} color={"#737373"} className={"sm:w-16 sm:h-16"} />
                    <h1 className={"text-2xl sm:text-3xl lg:text-4xl text-[#737373] font-semibold text-center px-4"}>
                        К сожалению корзина пуста
                    </h1>
                </div>
            }
        </>
    )
}