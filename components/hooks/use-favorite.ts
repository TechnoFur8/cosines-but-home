import { useGetFavoriteQuery } from "@/store/apiSlice"

interface Props {
    productId: number
}

export const useFavorite = ({ productId }: Props) => {
    const { data } = useGetFavoriteQuery()

    const checkFavorite = data?.favoriteProduct.find(el => el.productId === productId)

    return !!checkFavorite
}