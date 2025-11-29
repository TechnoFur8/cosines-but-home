"use client"

import { DatePost } from "@/lib/date-post"
import { useGetAdminRatingQuery } from "@/store/apiSlice"
import { Star, MessageSquare } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { RatingDeleteAdmin } from "./rating-delete-admin"

export const AdminPanelRatings = () => {
    const { data, isLoading, isError } = useGetAdminRatingQuery()

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
            <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Нет отзывов</h2>
            <p className="text-gray-500 text-center text-sm sm:text-base">Пока нет отзывов от пользователей</p>
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
        <div className="w-full">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    Все отзывы ({data.length})
                </h2>
            </div>
            <ScrollArea className='h-[600px] sm:h-[700px]'>
                <div className={"space-y-4 pr-4"}>
                    {data.map(el => (
                        <div 
                            className={
                                "bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 " +
                                "hover:shadow-md transition-shadow relative"
                            } 
                            key={el.id}
                        >
                            <RatingDeleteAdmin ratingId={el.id} />
                            <div className="pr-20">
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
            </ScrollArea>
        </div>
    )
}