"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { selectedSize } from "@/lib/selected-size"
import { usePostCartMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"
import { useCart } from "../hooks/use-cart"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { LoaderCircle } from "lucide-react"

interface Props {
    className?: string
    productSize: string
    price: number
    discount: number
    productId: number
}

export const SelectedSize = ({ productSize, price, discount, productId, className }: Props) => {
    const [selectSize, setSelectSize] = useState("")
    const [postCart, { error, isLoading }] = usePostCartMutation()
    const check = useCart({ productId, size: selectSize })
    const router = useRouter()

    useEffect(() => {
        if (error) {
            if ("status" in error && error.status === 401) {
                return router.push("/profil/registration")
            }
        }
    }, [error])

    const handleClickPostCart = async (productId: number) => {
        try {
            await toast.promise(
                postCart({ id: productId, size: selectSize }).unwrap(),
                {
                    loading: "Добавляем товар в корзину",
                    success: "Добавили товар в корзину",
                    error: "Произошла ошибка"
                }
            )
        } catch (err) {
            if (selectSize.length === 0) {
                return toast("Выберите размер", { icon: "❗" })
            }

            if (check) {
                return toast("Товар уже в корзине", { icon: "❗" })
            }

            console.error(err)
            return toast.error("Произошла ошибка")
        }

    }

    return (
        <Dialog>
            <DialogTrigger className={cn("cursor-pointer inline-flex items-center w-full  justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 ", className)}>
                В корзину
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Выберите размер</DialogTitle>
                </DialogHeader>
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
                <DialogFooter>
                    <DialogClose asChild><Button variant={"secondary"}>Закрыть</Button></DialogClose>
                    <Button disabled={isLoading} onClick={() => handleClickPostCart(productId)}>{isLoading ? <><LoaderCircle className={"animate-spin"} /> Добавляем в корзину</> : "В корзину"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}