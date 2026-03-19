import Link from "next/link"
import { SelectedSize } from "./selected-size"
import { FavoritePost } from "./favorite-post"
import { Product } from "@/types/product"
import { ImageClient } from "./image-client"

async function getProducts() {
    const res = await fetch("http://localhost:3000/api/products-popular", {
        cache: "no-store"
    })

    return res.json()
}

export const MainPagePopular = async () => {
    const productsPopular = await getProducts()

    return (
        <>
            <h2 className={"sm:text-3xl text-2xl font-semibold my-4"}>Чаще всего покупают</h2>
            <div className={"grid sm:grid-cols-5 grid-cols-2 sm:gap-3 gap-1"}>
                {productsPopular?.map((el: Product) => (
                    <div key={el.id} className={"space-y-2 flex flex-col justify-between shadow-lg rounded-2xl p-1 border-1 border-zinc-200 relative"}>
                        <Link href={`/product/${el.id}`} className={"space-y-2"}>
                            <div className={"h-64 w-full"}>
                                <ImageClient w={500} h={500} src={el.img[0]} alt={el.name} className={"w-full h-full object-cover rounded-t-2xl"} />
                            </div>
                            <p className={"sm:text-[18px] text-base"}>{el.name.length > 20 ? el.name.slice(0, 20) + "..." : el.name}</p>
                            <div className={"flex flex-col"}>
                                <span className={"font-bold sm:text-base text-sm"}>{el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                <span className={"line-through text-[#737373] sm:text-sm text-xs"}>{el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            </div>
                        </Link>
                        <SelectedSize className={"w-full mb-0 cursor-pointer"} productId={el.id} productSize={el.size} price={el.price} discount={el.discount} />
                        <FavoritePost productId={el.id} />
                    </div>
                ))}
            </div>
        </>
    )
}