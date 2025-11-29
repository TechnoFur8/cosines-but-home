"use client"

import { DatePost } from "@/lib/date-post"
import { useGetRatingQuery, useGetAdminRatingQuery } from "@/store/apiSlice"
import { ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { RatingDeleteAdmin } from "./rating-delete-admin"

interface Props {
    productId: number
}

export const Rating = ({ productId }: Props) => {
    const { data, isLoading, isError } = useGetRatingQuery(productId)
    // Проверяем, является ли пользователь админом (если запрос успешен, значит админ)
    const { data: adminData, isError: isAdminError } = useGetAdminRatingQuery()

    const isAdmin = !isAdminError && adminData !== undefined

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Загрузка отзывов...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Ошибка загрузки</div>
        </div>
    )
    if (!data) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Ошибка загрузки рейтинга</div>
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
        <>
            {data.length > 0 && (
                <h3 className={"text-xl sm:text-2xl font-semibold mb-4 mt-6"}>Отзывы о товаре</h3>
            )}
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
            {data.length > 20 &&
                <div className={"flex justify-end mt-4"}>
                    <Link className={"text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"} href={`/rating/${productId}`}>
                        Смотреть все отзывы <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            }
        </>
    )
}