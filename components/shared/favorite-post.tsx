"use client"

import { useDeleteFavoriteMutation, usePostFavoriteMutation } from "@/store/apiSlice"
import { Heart } from "lucide-react"
import toast from "react-hot-toast"
import { useFavorite } from "../hooks/use-favorite"


interface Props {
    productId: number
}

export const FavoritePost = ({ productId }: Props) => {
    const [postFavorite] = usePostFavoriteMutation()
    const [deleteFavorite] = useDeleteFavoriteMutation()
    const checkFavorite = useFavorite({ productId })

    const handleClickFavoritePost = async (productId: number) => {
        try {
            await postFavorite(productId).unwrap()
            toast.success("Товар добавлен в избранное")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    const handleClickDeleteFavorite = async (productId: number) => {
        try {
            await deleteFavorite(productId).unwrap()
            toast.success("Товар удален из избранного")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <button className={"cursor-pointer absolute right-2 top-2"}>
            <Heart fill={checkFavorite ? "red" : "#bababa"} onClick={() => { checkFavorite ? handleClickDeleteFavorite(productId) : handleClickFavoritePost(productId) }} />
        </button>
    )
}