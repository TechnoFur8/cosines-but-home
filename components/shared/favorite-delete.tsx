import { useDeleteFavoriteMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { Button } from "../ui/button"
import { LoaderCircle } from "lucide-react"

interface Props {
    id: number
}

export const FavoriteDelete = ({ id }: Props) => {
    const [deleteFavorite, { isLoading }] = useDeleteFavoriteMutation()

    const handleClickDeleteFavorite = async (id: number) => {
        try {
            await deleteFavorite(id).unwrap()
            toast.success("Удалили товар из избранного")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <Button onClick={() => handleClickDeleteFavorite(id)} variant={"secondary"} className={"cursor-pointer shadow"}>
            {isLoading
                ?
                <>
                    Удаляем
                    <LoaderCircle className={"animate-spin"} />
                </>
                :
                "Удалить"
            }
        </Button>
    )
}