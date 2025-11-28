"use client"

import { useGetCatalogQuery } from "@/store/apiSlice"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { CatalogUpdate } from "./catalog-update"

type User = { userId: number, userEmail: string, userRole: string }

interface Props {
    role: User | null
}

export const Catalog = ({ role }: Props) => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>

    return (
        <div className={"grid grid-cols-4 gap-4"}>
            {data?.map(el => (
                <div key={el.id} className={"bg-white shadow rounded-2xl p-2 relative"}>
                    <Link href={`/catalog/${el.id}`}>
                        <div className={"h-[223px]"}>
                            <CldImage className={"rounded-2xl object-cover w-full h-full"} width={500} height={500} src={el.img} alt={el.name} />
                        </div>
                        <span className={"text-[18px] "}>{el.name}</span>
                    </Link>
                    {role?.userRole === "ADMIN" &&
                        <CatalogUpdate isName={el.name} isImg={el.img} isId={el.id} />
                    }
                </div>
            ))}
        </div>
    )
}                                                                                       