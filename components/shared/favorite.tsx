"use client"

import { useGetFavoriteQuery } from "@/store/apiSlice"
import { CldImage } from "next-cloudinary"
import { FavoriteDelete } from "./favorite-delete"
import { SelectedSize } from "./selected-size"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

export const Favorite = () => {
    const { data, isLoading, isError, error } = useGetFavoriteQuery()
    const router = useRouter()

    useEffect(() => {
        if (error) {
            if ("status" in error && error.status === 401) {
                return router.push("/profil/registration")
            }
        }
    }, [error])

    if (isLoading) return (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-gray-500 text-base sm:text-lg">Загрузка избранного...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-red-500 text-base sm:text-lg">Ошибка загрузки</div>
        </div>
    )
    if (!data) return (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-red-500 text-base sm:text-lg">Ошибка загрузки избранного</div>
        </div>
    )

    if (data.favoriteProduct.length === 0) return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-lg border border-gray-200">
            <Heart className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Избранное пусто</h2>
            <p className="text-gray-500 text-center text-sm sm:text-base">
                Добавьте товары в избранное, чтобы не потерять их
            </p>
        </div>
    )

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />
                    Избранное ({data.favoriteProduct.length})
                </h2>
            </div>
            {data.favoriteProduct.map(el => (
                <div 
                    key={el.id} 
                    className={
                        "flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 " +
                        "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    }
                >
                    <Link 
                        href={`/product/${el.productId}`} 
                        className={"flex items-center gap-4 flex-1 min-w-0 group"}
                    >
                        <div className="relative flex-shrink-0">
                            <CldImage 
                                width={120} 
                                height={120} 
                                src={el.img} 
                                alt={el.name} 
                                className={"object-cover w-20 h-20 sm:w-24 sm:h-24 rounded-md group-hover:opacity-90 transition-opacity"} 
                            />
                        </div>
                        <div className={"flex flex-col gap-2 min-w-0 flex-1"}>
                            <span className={"text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors break-words"}>
                                {el.name}
                            </span>
                            <div className="flex flex-col gap-1">
                                <span className={"font-bold text-base sm:text-lg text-gray-900"}>
                                    {el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                </span>
                                {el.discount > 0 && (
                                    <span className={"line-through text-[#737373] text-sm"}>
                                        {el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                    <div className={"flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto"}>
                        <div className="flex-1 sm:flex-none">
                            <SelectedSize 
                                productId={el.productId} 
                                productSize={el.size} 
                                price={el.price} 
                                discount={el.discount}
                                className="w-full sm:w-auto"
                            />
                        </div>
                        <div className="flex-1 sm:flex-none">
                            <FavoriteDelete id={el.productId} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}