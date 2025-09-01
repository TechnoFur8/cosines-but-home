"use client"

import { useRef, useState } from "react"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export const SearchProductsInput = () => {
    const [search, setSearch] = useState("")
    const linkRef = useRef<HTMLAnchorElement>(null)

    return (
        <>
            <div className={"relative flex items-center"}>
                <Input onKeyDown={e => e.key === "Enter" && linkRef.current?.click()} value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск" type="search" className={"pr-8"} />
                <Search onClick={() => linkRef.current?.click()} className={"absolute right-1 top-1/2 -translate-y-1/2"} />
            </div>
            <Link ref={linkRef} href={`/search?search=${search}`} />
        </>
    )
}