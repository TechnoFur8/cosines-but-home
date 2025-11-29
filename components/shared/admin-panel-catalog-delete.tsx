"use client"

import { useDeleteCatalogMutation } from "@/store/apiSlice"
import { useState } from "react"
import toast from "react-hot-toast"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { LoaderCircle, Trash2, Folder } from "lucide-react"


export const AdminPanelCatalogDelete = () => {
    const [deleteCatalog, { isLoading }] = useDeleteCatalogMutation()
    const [catalogId, setCatalogId] = useState(0)

    const handleCllickDeleteCatalog = async (id: number) => {
        if (id <= 0) {
            toast.error("Введите корректный ID каталога")
            return
        }
        try {
            await deleteCatalog(id).unwrap()
            toast.success("Каталог удален")
            setCatalogId(0)
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <div className={"w-full"}>
            <div className="mb-4 sm:mb-6">
                <h2 className={"text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-2"}>
                    <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    Удалить каталог
                </h2>
                <p className="text-sm text-gray-600">Введите ID каталога для удаления</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ID каталога</label>
                        <Input 
                            onChange={e => setCatalogId(Number(e.target.value))} 
                            value={catalogId || ""} 
                            placeholder="Введите ID каталога" 
                            type="number"
                            min="1"
                        />
                    </div>
                    <Button 
                        disabled={isLoading || catalogId <= 0} 
                        onClick={() => handleCllickDeleteCatalog(catalogId)}
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className={"animate-spin mr-2"} />
                                Удаляем каталог
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить каталог
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}