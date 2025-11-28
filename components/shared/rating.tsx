import { DatePost } from "@/lib/date-post"
import { useGetRatingQuery } from "@/store/apiSlice"
import { ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { JSX } from "react"

interface Props {
    productId: number
}

export const Rating = ({ productId }: Props) => {
    const { data, isLoading, isError } = useGetRatingQuery(productId)

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки рейтинга</h1>

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
            <h3 className={"text-2xl font-medium mb-2 mt-4"}>Отзывы о товаре</h3>
            <div className={"space-y-4"}>
                {data.map(el => (
                    <div className={"shadow rounded-2xl p-4 border border-zinc-200 space-y-3 relative"} key={el.id}>
                        <div>
                            <p className="font-medium">{el.name}</p>
                            <p className={"text-[#737373] text-sm"}>{DatePost(el.createdAt)}</p>
                        </div>
                        <div className={"flex"}>{renderStars(el.rating)}</div>
                        <p>{el.description}</p>
                    </div>
                ))}
            </div>
            {data.length > 20 &&
                <div className={"flex justify-end mt-4"}>
                    <Link className={"text-blue-500 flex items-center"} href={`/rating/${productId}`}>Смотреть все отзывы <ChevronRight /></Link>
                </div>
            }
        </>
    )
}