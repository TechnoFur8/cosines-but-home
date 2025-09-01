import { useGetRatingQuery } from "@/store/apiSlice";
import { Progress } from "../ui/progress";
import { Star } from "lucide-react";
import { RatingPost } from "./rating-post";

interface Props {
    productId: number
}

export const RatingCharacter = ({ productId }: Props) => {
    const { data, isLoading, isError } = useGetRatingQuery(productId)

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки рейтинга</h1>

    const overallRating = data.length !== 0 ? data.map(el => el.rating).reduce((acc, el) => acc + el, 0) / data.length : 0

    const calculatePercentage = (num: number[]): number[] => {
        const total = num.reduce((acc, el) => acc + el, 0)

        if (total === 0) return [0, 0, 0, 0, 0]

        return num.map(el => (el / total) * 100)
    }

    const ratingCounts = [0, 0, 0, 0, 0]

    data.forEach(el => {
        ratingCounts[el.rating - 1]++
    })

    const percentages = calculatePercentage(ratingCounts)

    let starsFull = []
    let startEmpty = []
    let star = 5 - Math.round(overallRating)


    for (let i = 0; i < Math.round(overallRating); i++) {
        starsFull.push(<Star key={i} fill="#ffa500" color="#ffa500" />)
    }

    for (let i = 0; i < star; i++) {
        startEmpty.push(<Star key={i} fill="#d1d1d1" color="#d1d1d1" />)
    }

    return (
        <>
            <div className={"flex gap-x-8 mt-30"}>
                {data.length !== 0
                    ?
                    <>
                        <div className={"flex flex-col items-start space-y-3"}>
                            <span className={"text-4xl font-semibold"}>{overallRating}</span>
                            <div className={"flex"}>
                                {starsFull.map(el => el)}{startEmpty.map(el => el)}
                            </div>
                            <span>{data.length}</span>
                        </div>
                        <div className={"space-y-3"}>
                            <div className={"flex items-center gap-x-2"}>
                                <span className={"text-sm"}>5</span>
                                <Progress className={"w-90"} value={percentages[4]} />
                                <span className={"text-sm text-[#737373]"}>{percentages[4]}%</span>
                            </div>
                            <div className={"flex items-center gap-x-2"}>
                                <span className={"text-sm"}>4</span>
                                <Progress className={"w-90"} value={percentages[3]} />
                                <span className={"text-sm text-[#737373]"}>{percentages[3]}%</span>
                            </div>
                            <div className={"flex items-center gap-x-2"}>
                                <span className={"text-sm"}>3</span>
                                <Progress className={"w-90"} value={percentages[2]} />
                                <span className={"text-sm text-[#737373]"}>{percentages[2]}%</span>
                            </div>
                            <div className={"flex items-center gap-x-2"}>
                                <span className={"text-sm"}>2</span>
                                <Progress className={"w-90"} value={percentages[1]} />
                                <span className={"text-sm text-[#737373]"}>{percentages[1]}%</span>
                            </div>
                            <div className={"flex items-center gap-x-2"}>
                                <span className={"text-sm"}>1</span>
                                <Progress className={"w-90"} value={percentages[0]} />
                                <span className={"text-sm text-[#737373]"}>{percentages[0]}%</span>
                            </div>
                        </div>
                    </>
                    :
                    <h2 className={"text-3xl font-semibold"}>Нет отзывов</h2>
                }
            </div>
            <RatingPost productId={productId} />
        </>
    )
}