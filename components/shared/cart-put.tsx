import { LoaderCircle, Minus, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { usePutCartMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"

interface Props {
    productId: number
    quantity: number
}

export const CartPut = ({ productId, quantity }: Props) => {
    const [putCart, { isLoading }] = usePutCartMutation()

    const handleClickPutCart = async (productId: number, quantity: number) => {
        try {
            await putCart({ id: productId, quantity }).unwrap()
            if (quantity < 1) {
                toast.success("Товар удален из корзины")
            }
        } catch (err) {
            console.error(err)
            toast.error("Не смогли обновить количество")
        }
    }

    return (
        <div className={"flex items-center gap-x-2"}>
            <Button className={"cursor-pointer shadow size-1 rounded-full"} onClick={() => handleClickPutCart(productId, quantity - 1)} variant={"secondary"} disabled={isLoading}>{isLoading ? <LoaderCircle className={"animate-spin"} /> : <Minus />}</Button>
            <span>{quantity}</span>
            <Button className={"cursor-pointer shadow size-1 rounded-full"} onClick={() => handleClickPutCart(productId, quantity + 1)} variant={"secondary"} disabled={isLoading}>{isLoading ? <LoaderCircle className={"animate-spin"} /> : <Plus />}</Button>
        </div>
    )
}