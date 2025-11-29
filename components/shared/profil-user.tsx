"use client"

import { useGetUserQuery } from "@/store/apiSlice"
import { User } from "lucide-react"

export const ProfilUser = () => {
    const { data, isLoading, isError } = useGetUserQuery()

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Загрузка...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Ошибка загрузки</div>
        </div>
    )
    if (!data) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Ошибка загрузки профиля</div>
        </div>
    )

    const user = data.user

    return (
        <div className={
            "bg-white border border-gray-200 shadow-sm rounded-lg p-5 sm:p-6 " +
            "hover:shadow-md transition-shadow"
        }>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Профиль</h2>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">Имя</span>
                    <span className="text-base sm:text-lg font-medium text-gray-900">{user.name}</span>
                </div>
                <div className="flex flex-col gap-1 pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-base sm:text-lg font-medium text-gray-900 break-all">{user.email}</span>
                </div>
            </div>
        </div>
    )
}