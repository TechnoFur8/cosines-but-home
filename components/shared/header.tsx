import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SearchProductsInput } from "./search-products-input"

export const Header = () => {
    return (
        <>
            <div className={"flex items-center justify-between max-w-7xl m-auto my-5"}>
                <div className={"flex items-center gap-x-3 font-medium"}>
                    <Link className={"mr-5"} href={"/"}>
                        <Image src="/logo.svg" width={100} height={100} alt="logo" />
                    </Link>
                    <Link href={"/"}>Главная</Link>
                    <Link href={"/catalog"}>Каталог</Link>
                    <Link href={"/about-us"}>О нас</Link>
                </div>
                <div className={"flex items-center gap-x-3"}>
                    <SearchProductsInput />
                    <div className={"flex items-center gap-x-2"}>
                        <div className={"bg-[#EDEDED] rounded-full p-2.5 cursor-pointer"}>
                            <Link href={"/favorite"}>
                                <Heart />
                            </Link>
                        </div>
                        <div className={"bg-[#EDEDED] rounded-full p-2.5 cursor-pointer"}>
                            <Link href={"/cart"}>
                                <ShoppingCart />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[1px] w-full bg-[#EDEDED] shadow" />
        </>
    )
}