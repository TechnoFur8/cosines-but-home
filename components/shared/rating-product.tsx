import { useGetRatingQuery } from "@/store/apiSlice"

interface Props {
    productId: number
}

export const RatingProduct = ({ productId }: Props) => {
    const { data, isLoading, isError } = useGetRatingQuery(productId)

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки рейтинга</h1>

    return (
        <div>
            {data.map(el => (
                <div>
                    <span>{el.name}</span>
                </div>
            ))}
        </div>
    )
}