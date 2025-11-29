"use client"

import { useDeleteProductMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { Input } from "../ui/input"
import { useState } from "react"
import { Button } from "../ui/button"
import { LoaderCircle, Trash2, Package } from "lucide-react"

export const AdminPanelProductDelete = () => {
    const [productId, setProductId] = useState(0)
    const [deleteProduct, { isLoading }] = useDeleteProductMutation()

    const handleClickDeleteProduct = async (id: number) => {
        if (id <= 0) {
            toast.error("Введите корректный ID товара")
            return
        }
        try {
            await deleteProduct(id).unwrap()
            toast.success("Товар удален")
            setProductId(0)
        } catch (err) {
            console.error(err)
            toast.error("Ошибка удаления товара")
        }
    }

    return (
        <div className={"w-full"}>
            <div className="mb-4 sm:mb-6">
                <h2 className={"text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-2"}>
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    Удалить товар
                </h2>
                <p className="text-sm text-gray-600">Введите ID товара для удаления</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ID товара</label>
                        <Input 
                            onChange={e => setProductId(Number(e.target.value))} 
                            value={productId || ""} 
                            placeholder="Введите ID товара" 
                            type="number"
                            min="1"
                        />
                    </div>
                    <Button 
                        disabled={isLoading || productId <= 0} 
                        onClick={() => handleClickDeleteProduct(productId)}
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className={"animate-spin mr-2"} />
                                Удаляем товар
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить товар
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}