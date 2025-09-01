import { useDeleteCartMutation } from "@/store/apiSlice"
import { Button } from "../ui/button"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"

interface Props {
    id: number
}

export const CartDelete = ({ id }: Props) => {
    const [cartDelete, { isLoading }] = useDeleteCartMutation()

    const handleClickCartDelete = async (id: number) => {
        try {
            await cartDelete(id).unwrap()
            toast.success("Удалили товар из корзины")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <Button disabled={isLoading} onClick={() => handleClickCartDelete(id)} variant={"secondary"} className={"cursor-pointer h-full min-w-15 shadow"}>
            {isLoading ?
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