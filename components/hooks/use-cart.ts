"use client"

import { useGetCartQuery } from "@/store/apiSlice"

interface Props {
    productId: number
    size: string
}

export const useCart = ({ productId, size }: Props) => {
    const { data } = useGetCartQuery()

    const checkCart = data?.cartProduct.find(el => el.productId === productId && el.size === size)

    return !!checkCart
}