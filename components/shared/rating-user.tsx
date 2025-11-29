"use client"

import { useGetMyRatingQuery } from "@/store/apiSlice"
import { RatingPost } from "./rating-post"
import { Star } from "lucide-react"
import { DatePost } from "@/lib/date-post"
import { RatingDelete } from "./rating-delete"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import Link from "next/link"

interface Props {
    productId: number
}

export const RatingUser = ({ productId }: Props) => {
    const { data, isLoading, isError, error } = useGetMyRatingQuery(productId)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        if (error) {
            if ("status" in error && error.status === 401) {
                return setErrorMessage("Авторизуйтесь чтобы оставить отзыв")
            }
        }
    }, [error])


    if (isLoading) return <h1>Loading...</h1>
    if (errorMessage) return (
        <>
            <h3 className={"text-2xl font-medium mb-2 mt-4"}>Ваш отзыв</h3>
            <Link className={"text-blue-500 underline py-3"} href="/profil/registration">{errorMessage}</Link>
        </>
    )
    if (isError) return <h1>Error</h1>
    if (!data) return null

    if (!data.rating) {
        return (
            <div>
                <RatingPost productId={productId} />
            </div>
        )
    }

    let rating = []

    for (let i = 0; i < data.rating.rating; i++) {
        rating.push(<Star key={`filled-${i}`} fill="#ffa500" color="#ffa500" />)
    }

    for (let i = 0; i < 5 - data.rating.rating; i++) {
        rating.push(<Star key={`empty-${i}`} fill="#d1d1d1" color="#d1d1d1" />)
    }

    return (
        <>
            <h3 className={"sm:text-2xl text-lg font-medium mb-2 mt-4"}>Ваш отзыв</h3>
            <div className={"shadow rounded-2xl p-4 border border-zinc-200 space-y-3 relative"}>
                <div>
                    <p className="font-medium">{data.rating.name}</p>
                    <p className={"text-[#737373] text-sm"}>{DatePost(data.rating.createdAt)}</p>
                </div>
                <div className={"flex"}>{rating.map(el => el)}</div>
                <p className={"text-sm sm:text-base"}>{data.rating.description}</p>
                <div className={"absolute top-3 right-3"}>
                    <RatingDelete ratingId={data.rating.id} />
                </div>
            </div>
        </>
    )
}   