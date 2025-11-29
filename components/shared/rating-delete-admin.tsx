"use client"

import { useDeleteRatingMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { Button } from "../ui/button"
import { LoaderCircle, Trash2 } from "lucide-react"

interface Props {
    ratingId: number
}

export const RatingDeleteAdmin = ({ ratingId }: Props) => {
    const [deleteRating, { isLoading }] = useDeleteRatingMutation()

    const handleClickDeleteRating = async (ratingId: number) => {
        try {
            await deleteRating(ratingId).unwrap()
            toast.success("Отзыв удален")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка при удалении отзыва")
        }
    }

    return (
        <Button
            onClick={() => handleClickDeleteRating(ratingId)}
            disabled={isLoading}
            variant="destructive"
            size="sm"
            className="absolute top-3 right-3"
        >
            {isLoading ? (
                <>
                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                    Удаляем
                </>
            ) : (
                <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить
                </>
            )}
        </Button>
    )
}

