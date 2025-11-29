"use client"

import { useGetOrderQuery } from "@/store/apiSlice"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { Package, ShoppingBag } from "lucide-react"

export const AdminPanelOrder = () => {
    const { data, isLoading, isError } = useGetOrderQuery()

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Загрузка заказов...</div>
        </div>
    )
    if (isError) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Ошибка загрузки</div>
        </div>
    )

    const order = data?.orders

    if (!order || order.length === 0) return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Нет заказов</h2>
            <p className="text-gray-500 text-center text-sm">Пока нет оформленных заказов</p>
        </div>
    )

    const dataPublic = (component: string) => {
        let options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return new Date(component).toLocaleString("ru-RU", options)
    }

    return (
        <div className={"w-full"}>
            <div className="mb-4 sm:mb-6">
                <h2 className={"text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-2"}>
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    Последние заказы
                </h2>
                <p className="text-sm text-gray-600">Всего заказов: {order.length}</p>
            </div>
            <ScrollArea className='h-[600px] sm:h-[700px]'>
                <div className="space-y-4 pr-4">
                    {order.map((el) => (
                        <div 
                            key={el.id} 
                            className={
                                "bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 " +
                                "hover:shadow-md transition-shadow"
                            }
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-4 sm:-m-5 mb-4 sm:mb-5 px-4 sm:px-5 py-3 border-b border-gray-200 rounded-t-lg">
                                <h3 className={"text-lg sm:text-xl font-semibold text-gray-900"}>Заказ №{el.id}</h3>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-xs text-gray-500">Имя покупателя:</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">{el.name}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-xs text-gray-500">Email:</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-900 break-all">{el.email}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-xs text-gray-500">Адрес:</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-900 break-words">{el.address}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-xs text-gray-500">Телефон:</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">{el.phone}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-xs text-gray-500">Доставка:</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">{el.delivery}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-xs text-gray-500">Оплата:</span>
                                    <span className="text-sm sm:text-base font-medium text-gray-900">{el.pay}</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Товары в заказе:
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {el.orderItems.map(item => (
                                        <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <div className="mb-2">
                                                <span className="text-xs text-gray-500">Название:</span>
                                                <div>
                                                    <Link className={"text-sm sm:text-base font-medium text-blue-600 hover:text-blue-700 underline hover:no-underline transition-colors"} href={`/product/${item.productId}`}>
                                                        {item.productName}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Размер: </span>
                                                    <span className="font-medium text-gray-900">{item.size}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Количество: </span>
                                                    <span className="font-medium text-gray-900">{item.quantity}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Цена: </span>
                                                    <span className="font-medium text-gray-900">
                                                        {item.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 mt-4 border-t-2 border-gray-300 flex justify-between items-center">
                                <span className="text-base sm:text-lg font-semibold text-gray-700">Итого:</span>
                                <span className="text-lg sm:text-xl font-bold text-gray-900">
                                    {el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}