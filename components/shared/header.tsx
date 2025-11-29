"use client"

import { Heart, Home, MapPinHouse, Menu, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SearchProductsInput } from "./search-products-input"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export const Header = () => {
    const pathname = usePathname()

    return (
        <div>
            <div className={"sm:block hidden"}>
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
                            <div className={"bg-[#EDEDED] rounded-full p-2.5 cursor-pointer"}>
                                <Link href={"/profil"}>
                                    <User />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[1px] w-full bg-[#EDEDED] shadow" />
            </div>
            <div className={"sm:hidden block"}>
                <div className="fixed top-0 left-0 right-0 bg-white z-50 w-full rounded-b-2xl shadow-md border-b border-[#EDEDED]">
                    <div className="px-4 py-2">
                        <SearchProductsInput />
                    </div>
                </div>
                <div className={"bg-white fixed bottom-0 z-50 w-full"}>
                    <div className="h-[1px] w-full bg-[#EDEDED] shadow" />
                    <div className={"flex justify-between items-center p-4"}>
                        <Link className={cn(pathname === "/" && "text-blue-500")} href={"/"}><Home /></Link>
                        <Link className={cn(pathname === "/catalog" && "text-blue-500")} href={"/catalog"}><Menu /></Link>
                        <Link className={cn(pathname === "/about-us" && "text-blue-500")} href={"/about-us"}><MapPinHouse /></Link>
                        <Link className={cn(pathname === "/favorite" && "text-blue-500")} href={"/favorite"}><Heart /></Link>
                        <Link className={cn(pathname === "/cart" && "text-blue-500")} href={"/cart"}><ShoppingCart /></Link>
                        <Link className={cn(pathname === "/profil" && "text-blue-500")} href={"/profil"}><User /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}