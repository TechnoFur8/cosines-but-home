"use client"

import { useDeleteProductMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { Input } from "../ui/input"
import { useState } from "react"
import { Button } from "../ui/button"
import { LoaderCircle } from "lucide-react"

export const AdminPanelProductDelete = () => {
    const [productId, setProductId] = useState(0)
    const [deleteProduct, { isLoading }] = useDeleteProductMutation()

    const handleClickDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id).unwrap()
            toast.success("Товар удален")
        } catch (err) {
            console.error(err)
            toast.error("Ошибка удаления товара")
        }
    }

    return (
        <div className={"my-5"}>
            <h2 className={"font-medium text-2xl mb-5"}>Удалить товар</h2>
            <span>Введите ID товара</span>
            <div className="flex">
                <Input onChange={e => setProductId(Number(e.target.value))} value={productId} placeholder="ID товара" type="number" />
                <Button disabled={isLoading} onClick={() => handleClickDeleteProduct(productId)}>{isLoading ? <> <LoaderCircle className={"animate-spin"} /> Удаляем товар</> : "Удалить"}</Button>
            </div>
        </div>
    )
}