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
    name: string
    rating: number
    description: string
    createdAt: string
}

interface RatingPost {
    ratingStar: number
    description: string
}

interface UserRegistration {
    name?: string
    email: string
    password: string
    repeatPassword?: string
}

interface User {
    id: number
    name: string
    email: string
}

interface Order {
    phone: string
    address: string
    delivery: string
    pay: string
    email: string
    policy: boolean
}

interface OrderUser {
    id: number
    name: string
    email: string
    address: string
    phone: string
    delivery: string
    pay: string
    total: number
    createdAt: string
    orderItems: [
        {
            id: number
            quantity: number
            productName: string
            price: number
            size: string
            productId: number
        }
    ]
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/",
        credentials: "include"
    }),

    tagTypes: ["Product", "Cart", "Favorite", "Catalog", "Rating", "User", "Order"],
    endpoints: (builder) => ({
        signinUser: builder.mutation<void, UserRegistration>({
            query: (body) => ({
                url: "/api/user/signin",
                method: "POST",
                body
            }),
            invalidatesTags: ["User"]
        }),
        signupUser: builder.mutation<void, UserRegistration>({
            query: (body) => ({
                url: "/api/user/signup",
                method: "POST",
                body
            }),
            invalidatesTags: ["User"]
        }),
        getUser: builder.query<{ user: User }, void>({
            query: () => "/api/user",
            providesTags: ["User"]
        }),

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
        postProduct: builder.mutation<Product, FormData>({
            query: (formData) => ({
                url: "/api/products",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Product"]
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"]
        }),
        updateProduct: builder.mutation<void, { id: number, formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/api/products/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Product"]
        }),

        postCart: builder.mutation<void, { id: number, size: string }>({
            query: ({ id, size }) => ({
                url: `/api/cart/${id}`,
                method: "POST",
                body: { size }
            }),
            invalidatesTags: ["Cart"]
        }),
        getCart: builder.query<{ cartProducts: CartProduct[] }, void>({
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

        postCatalog: builder.mutation<Catalog, FormData>({
            query: (formData) => ({
                url: "/api/catalogs",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Catalog"]
        }),
        getCatalog: builder.query<Catalog[], void>({
            query: () => "/api/catalogs",
            providesTags: ["Catalog"]
        }),
        getCatalogProducts: builder.query<Product[], { id: number, limit: number }>({
            query: ({ id, limit }) => `/api/catalogs/${id}?limit=${limit}`,
            providesTags: ["Product"]
        }),
        deleteCatalog: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/catalogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Catalog"]
        }),
        updateCatalog: builder.mutation<void, { id: number, formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/api/catalogs/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Catalog"]
        }),

        postRating: builder.mutation<void, { id: number, rating: RatingPost }>({
            query: ({ id, rating }) => ({
                url: `/api/ratings/${id}`,
                method: "POST",
                body: rating
            }),
            invalidatesTags: ["Rating"]
        }),
        deleteRatingUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/rating-user/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Rating"]
        }),
        getRating: builder.query<Rating[], number>({
            query: (id) => `/api/ratings/${id}`,
            providesTags: ["Rating"]
        }),
        getMyRating: builder.query<{ rating: Rating }, number>({
            query: (id) => `/api/rating-user/${id}`,
            providesTags: ["Rating"]
        }),
        getAdminRating: builder.query<Rating[], void>({
            query: () => "/api/rating-admin",
            providesTags: ["Rating"]
        }),
        getAllRatingProducts: builder.query<Rating[], number>({
            query: (id) => `/api/rating-products/${id}`,
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
        }),

        postOrder: builder.mutation<void, Order>({
            query: (body) => ({
                url: "/api/order",
                method: "POST",
                body
            }),
            invalidatesTags: ["Order"]
        }),
        getUserOrder: builder.query<{ orders: OrderUser[] }, void>({
            query: () => "/api/order-user",
            providesTags: ["Order"]
        }),
        getOrder: builder.query<{ orders: OrderUser[] }, void>({
            query: () => "/api/order",
            providesTags: ["Order"]
        })
    })
})

export const {
    useSigninUserMutation,
    useSignupUserMutation,
    useGetUserQuery,

    useLazyGetProductsQuery,
    useGetPopularProductsQuery,
    useGetProductOneQuery,
    useLazyGetSearchProductsQuery,
    usePostProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,

    usePostCartMutation,
    useGetCartQuery,
    usePutCartMutation,
    useDeleteCartMutation,

    usePostFavoriteMutation,
    useGetFavoriteQuery,
    useDeleteFavoriteMutation,

    usePostCatalogMutation,
    useGetCatalogQuery,
    useLazyGetCatalogProductsQuery,
    useDeleteCatalogMutation,
    useUpdateCatalogMutation,

    usePostRatingMutation,
    useDeleteRatingUserMutation,
    useGetRatingQuery,
    useGetMyRatingQuery,
    useGetAdminRatingQuery,
    useGetAllRatingProductsQuery,
    usePutRatingMutation,
    useDeleteRatingMutation,

    usePostOrderMutation,
    useGetOrderQuery,
    useGetUserOrderQuery
} = apiSlice
