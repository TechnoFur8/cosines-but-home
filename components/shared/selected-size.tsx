"use client"

import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { selectedSize } from "@/lib/selected-size"
import { usePostCartMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { useCart } from "../hooks/use-cart"
import { cn } from "@/lib/utils"

interface Props {
    className?: string
    productSize: string
    price: number
    discount: number
    productId: number
}

export const SelectedSize = ({ productSize, price, discount, productId, className }: Props) => {
    const [selectSize, setSelectSize] = useState("")
    const [postCart] = usePostCartMutation()
    const check = useCart({ productId, size: selectSize })

    const handleClickPostCart = async (productId: number) => {
        if (selectSize.length === 0) {
            return toast("Выберите размер", { icon: "❗" })
        }

        if (check) {
            return toast("Товар уже в корзине", { icon: "❗" })
        }

        toast.promise(
            postCart({ id: productId, size: selectSize }).unwrap(),
            {
                loading: "Добовляем товар в корзину",
                success: "Добавили товар в корзину",
                error: "Произошла ошибка",
            }
        )
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className={cn("cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 ", className)}>
                В корзину
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Выберите размер</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Select value={selectSize} onValueChange={setSelectSize}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите размер" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {productSize.split(" ").map((el, i) => (
                                        <SelectItem key={i} value={el}>{el}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className={"flex flex-col pt-2"}>
                            <span>Цена: {selectSize.length === 0
                                ?
                                price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })
                                :
                                selectedSize(selectSize, price).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })
                            }
                            </span>
                            <span>Скидка: {selectSize.length === 0
                                ?
                                discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })
                                :
                                selectedSize(selectSize, discount).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })
                            }
                            </span>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleClickPostCart(productId)}>В корзину</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}