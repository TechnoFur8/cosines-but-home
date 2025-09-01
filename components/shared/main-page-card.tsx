"use client"

import { useLazyGetProductsQuery } from "@/store/apiSlice";
import { CldImage } from 'next-cloudinary';
import Link from "next/link";
import { FavoritePost } from "./favorite-post";
import { SelectedSize } from "./selected-size";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer"

export const MainPageCard = () => {
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [limit, setLimit] = useState(15)
    const [trigger, { data, isLoading, isError }] = useLazyGetProductsQuery();
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false
    })

    useEffect(() => {
        if (inView && !isLoadingMore) {
            setIsLoadingMore(true)
            trigger({
                limit
            }).finally(() => {
                setIsLoadingMore(false)
                setLimit(el => el + 15)
            })
        }
    }, [trigger, inView, isLoading])

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>

    return (
        <>
            <h2 className={"text-3xl font-semibold my-4"}>Все товары</h2>
            <div className={"grid grid-cols-5 gap-3"}>
                {data?.map(el => (
                    <div key={el.id} className={"relative space-y-2 flex flex-col justify-between shadow-lg rounded-2xl p-1 border-1 border-zinc-200"}>
                        <Link href={`/product/${el.id}`} className={" space-y-2"}>
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
            <span>{isLoadingMore && "Loading..."}</span>
            <div ref={ref} />
        </>
    )
}