import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Product {
    id: number
    img: string[]
    name: string
    price: number
    discount: number
    compound: string
    warp: string
    hight: number
    hardness: number
    size: string
    description: string
    from: string
}

interface CartProduct {
    id: number
    img: string
    name: string
    quantity: number
    price: number
    discount: number
    size: string
    productId: number
}

interface FavoriteProduct {
    id: number
    img: string
    name: string
    price: number
    discount: number
    size: string
    productId: number
}

interface Catalog {
    id: number
    img: string
    name: string
}

interface Rating {
    id: number
    img: string[]
    name: string
    rating: number
    description: string
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/"
    }),
    tagTypes: ["Product", "Cart", "Favorite", "Catalog", "Rating"],
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], { limit: number }>({
            query: ({ limit }) => `/api/products?limit=${limit}`,
            providesTags: ["Product"]
        }),
        getPopularProducts: builder.query<Product[], void>({
            query: () => "/api/products-popular",
            providesTags: ["Product"]
        }),
        getProductOne: builder.query<Product, number>({
            query: (id) => `/api/products/${id}`,
            providesTags: ["Product"]
        }),
        getSearchProducts: builder.query<Product[], { search: string, limit: number }>({
            query: ({ search, limit }) => `/api/search-products?search=${search}&limit=${limit}`,
            providesTags: ["Product"]
        }),

        postCart: builder.mutation<void, { id: number, size: string }>({
            query: ({ id, size }) => ({
                url: `/api/cart/${id}`,
                method: "POST",
                body: { size }
            }),
            invalidatesTags: ["Cart"]
        }),
        getCart: builder.query<{ cartProduct: CartProduct[] }, void>({
            query: () => `/api/cart`,
            providesTags: ["Cart"]
        }),
        putCart: builder.mutation<void, { id: number, quantity: number }>({
            query: ({ id, quantity }) => ({
                url: `/api/cart/${id}`,
                method: "PUT",
                body: { quantity }
            }),
            invalidatesTags: ["Cart"]
        }),
        deleteCart: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/cart/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"]
        }),

        postFavorite: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/favorite/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Favorite"]
        }),
        getFavorite: builder.query<{ favoriteProduct: FavoriteProduct[] }, void>({
            query: () => `/api/favorite`,
            providesTags: ["Favorite"]
        }),
        deleteFavorite: builder.mutation<void, number>({
            query: (productId) => ({
                url: `/api/favorite/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Favorite"]
        }),

        getCatalog: builder.query<Catalog[], void>({
            query: () => "/api/catalogs",
            providesTags: ["Catalog"]
        }),
        getCatalogProducts: builder.query<Product[], { id: number, limit: number }>({
            query: ({ id, limit }) => `/api/catalogs/${id}?limit=${limit}`,
            providesTags: ["Product"]
        }),

        postRating: builder.mutation<void, { id: number, rating: FormData }>({
            query: ({ id, rating }) => ({
                url: `/api/ratings/${id}`,
                method: "POST",
                body: rating
            }),
            invalidatesTags: ["Rating"]
        }),
        getRating: builder.query<Rating[], number>({
            query: (id) => `/api/ratings/${id}`,
            providesTags: ["Rating"]
        }),
        getMyRating: builder.query<{rating: Rating}, number>({
            query: (id) => `/api/rating-my/${id}`,
            providesTags: ["Rating"]
        }),
        putRating: builder.mutation<Rating, { id: number, rating: Rating }>({
            query: ({ id, rating }) => ({
                url: `/api/ratings/${id}`,
                method: "PUT",
                body: rating
            }),
            invalidatesTags: ["Rating"]
        }),
        deleteRating: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/raings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Rating"]
        })
    })
})

export const {
    useLazyGetProductsQuery,
    useGetPopularProductsQuery,
    useGetProductOneQuery,
    useLazyGetSearchProductsQuery,

    usePostCartMutation,
    useGetCartQuery,
    usePutCartMutation,
    useDeleteCartMutation,

    usePostFavoriteMutation,
    useGetFavoriteQuery,
    useDeleteFavoriteMutation,

    useGetCatalogQuery,
    useLazyGetCatalogProductsQuery,

    usePostRatingMutation,
    useGetRatingQuery,
    useGetMyRatingQuery,
    usePutRatingMutation,
    useDeleteRatingMutation
} = apiSlice
