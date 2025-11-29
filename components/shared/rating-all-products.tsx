"use client"

import { DatePost } from "@/lib/date-post"
import { useGetAllRatingProductsQuery, useGetAdminRatingQuery } from "@/store/apiSlice"
import { Star } from "lucide-react"
import { useParams } from "next/navigation"
import { RatingDeleteAdmin } from "./rating-delete-admin"

export const RatingAllProducts = () => {
    const router = useParams()
    const productId = router.id
    const { data, isLoading, isError } = useGetAllRatingProductsQuery(Number(productId))
    // Проверяем, является ли пользователь админом
    const { data: adminData, isError: isAdminError } = useGetAdminRatingQuery()

    const isAdmin = !isAdminError && adminData !== undefined

    if (isLoading) return (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-gray-500 text-base sm:text-lg">Загрузка отзывов...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-red-500 text-base sm:text-lg">Ошибка загрузки</div>
        </div>
    )
    if (!data) return (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="text-red-500 text-base sm:text-lg">Ошибка загрузки рейтинга</div>
        </div>
    )

    if (data.length === 0) return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-lg border border-gray-200">
            <Star className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Нет отзывов</h2>
            <p className="text-gray-500 text-center text-sm sm:text-base">Пока нет отзывов для этого товара</p>
        </div>
    )

    const renderStars = (rating: number) => {
        const stars = []
        for (let i = 0; i < 5; i++) {
            const isFilled = i < rating
            stars.push(
                <Star
                    key={i}
                    size={16}
                    fill={isFilled ? "#ffa500" : "#d1d1d1"}
                    color={isFilled ? "#ffa500" : "#d1d1d1"}
                />
            )
        }
        return stars
    }

    return (
        <div className={"space-y-4"}>
            {data.map(el => (
                <div 
                    className={
                        "bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 " +
                        "hover:shadow-md transition-shadow relative"
                    } 
                    key={el.id}
                >
                    {isAdmin && <RatingDeleteAdmin ratingId={el.id} />}
                    <div className={isAdmin ? "pr-20" : ""}>
                        <div className="mb-3">
                            <p className="font-semibold text-base sm:text-lg text-gray-900 mb-1">{el.name}</p>
                            <p className={"text-gray-500 text-xs sm:text-sm"}>{DatePost(el.createdAt)}</p>
                        </div>
                        <div className={"flex gap-1 mb-3"}>{renderStars(el.rating)}</div>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{el.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}