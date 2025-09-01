"use client"

import { useGetFavoriteQuery } from "@/store/apiSlice"
import { CldImage } from "next-cloudinary"
import { FavoriteDelete } from "./favorite-delete"
import { SelectedSize } from "./selected-size"

export const Favorite = () => {
    const { data, isLoading, isError } = useGetFavoriteQuery()

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки избранного</h1>

    return (
        <div className={"space-y-6"}>
            {data.favoriteProduct.map(el => (
                <div key={el.id} className={"flex justify-between items-center"}>
                    <div className={"flex items-center gap-x-4"}>
                        <CldImage width={70} height={70} src={el.img} alt={el.name} className={"object-cover w-[70px] h-[70px]"} />
                        <div className={"flex flex-col"}>
                            <span>{el.name}</span>
                            <span>{el.price}</span>
                            <span>{el.discount}</span>
                        </div>
                    </div>
                    <div className={"flex gap-x-3"}>
                        <FavoriteDelete id={el.productId} />
                        <SelectedSize productId={el.productId} productSize={el.size} price={el.price} discount={el.discount} />
                    </div>
                </div>
            ))}
        </div>
    )
}