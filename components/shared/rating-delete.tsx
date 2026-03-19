import { useDeleteRatingUserMutation } from "@/store/apiSlice"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface Props {
    ratingId: number
}

export const RatingDelete = ({ ratingId }: Props) => {
    const [deleteRating, { isLoading }] = useDeleteRatingUserMutation()

    const handleClickDeleteRating = async (ratingId: number) => {
        try {
            await deleteRating(ratingId).unwrap()
            toast.success("Удалили отзыв")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <button onClick={() => handleClickDeleteRating(ratingId)} disabled={isLoading}>
            <Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' size={20} />
        </button>
    )
}