import { useDeleteFavoriteMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { Button } from "../ui/button"
import { LoaderCircle, Trash2 } from "lucide-react"

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
        <Button 
            onClick={() => handleClickDeleteFavorite(id)} 
            variant={"secondary"} 
            className={"cursor-pointer shadow w-full sm:w-auto min-w-[100px]"}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <LoaderCircle className={"animate-spin w-4 h-4 mr-2"} />
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