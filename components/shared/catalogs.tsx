"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { CatalogUpdate } from "./catalog-update"
import { Catalog } from "@/types/catalog"

type User = { userId: number, userEmail: string, userRole: string }

interface Props {
    role: User | null
    data: Catalog[]
}

export const Catalogs = ({data, role }: Props) => {
    return (
        <div className={"grid sm:grid-cols-4 grid-cols-1 gap-4"}>
            {data?.map((el: Catalog) => (
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