"use client"

import { useDeleteCatalogMutation } from "@/store/apiSlice"
import { useState } from "react"
import toast from "react-hot-toast"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { LoaderCircle } from "lucide-react"


export const AdminPanelCatalogDelete = () => {
    const [deleteCatalog, { isLoading }] = useDeleteCatalogMutation()
    const [catalogId, setCatalogId] = useState(0)

    const handleCllickDeleteCatalog = async (id: number) => {
        try {
            await deleteCatalog(id).unwrap()
            toast.success("Каталог удален")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <div className={"my-5"}>
            <h2 className={"font-medium text-2xl mb-5"}>Удалить каталог</h2>
            <span>Введите ID каталога</span>
            <Input onChange={e => setCatalogId(Number(e.target.value))} value={catalogId} placeholder="ID кталога" type="number" />
            <Button disabled={isLoading} onClick={() => handleCllickDeleteCatalog(catalogId)}>{isLoading ? <> <LoaderCircle className={"animate-spin"} /> Удаляем каталог</> : "Удалить"}</Button>
        </div>
    )
}