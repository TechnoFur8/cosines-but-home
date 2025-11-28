"use client"

import { useGetUserQuery } from "@/store/apiSlice"

export const ProfilUser = () => {
    const { data, isLoading, isError } = useGetUserQuery()

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки профиля</h1>

    const user = data.user

    return (
        <div className={"border-zinc-200 border shadow p-4 h-20 rounded-2xl"}>
            <h2>Имя: {user.name}</h2>
            <span>Email: {user.email}</span>
        </div>
    )
}