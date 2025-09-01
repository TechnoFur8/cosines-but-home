"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useGetPopularProductsQuery } from "@/store/apiSlice"
import { SelectedSize } from "./selected-size"
import { FavoritePost } from "./favorite-post"

export const MainPagePopular = () => {
    const { data, isLoading, isError } = useGetPopularProductsQuery()

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>

    return (
        <>
            <h2 className={"text-3xl font-semibold my-4"}>Чаще всего покупают</h2>
            <div className={"grid grid-cols-5 gap-3"}>
                {data?.map(el => (
                    <div key={el.id} className={"space-y-2 flex flex-col justify-between shadow-lg rounded-2xl p-1 border-1 border-zinc-200 relative"}>
                        <Link href={`/product/${el.id}`} className={"space-y-2"}>
                            <div className={"h-64 w-full"}>
                                <CldImage width={500} height={500} src={el.img[0]} alt={el.name} className={"w-full h-full object-cover rounded-t-2xl"} />
                            </div>
                            <p className={"text-[18px]"}>{el.name.length > 20 ? el.name.slice(0, 20) + "..." : el.name}</p>
                            <div className={"flex flex-col"}>
                                <span className={"font-bold"}>{el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                <span className={"line-through text-[#737373] text-sm"}>{el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            </div>
                        </Link>
                        <SelectedSize className={"w-full mb-0 cursor-pointer"} productId={el.id} productSize={el.size} price={el.price} discount={el.discount} />
                        <FavoritePost productId={el.id} />
                    </div>
                ))}
            </div>
        </>
    )
}