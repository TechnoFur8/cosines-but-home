"use client"

import { useGetUserOrderQuery } from "@/store/apiSlice"
import Link from "next/link"
import { ScrollArea } from "../ui/scroll-area"
import { Package, MapPin, Phone, Mail, User, Truck, CreditCard, ShoppingBag } from "lucide-react"

export const ProfilOrder = () => {
    const { data, isLoading, isError } = useGetUserOrderQuery()

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
    if (data?.orders.length === 0) return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-lg border border-gray-200">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Нет заказов</h2>
            <p className="text-gray-500 text-center">У вас пока нет оформленных заказов</p>
        </div>
    )
    if (!data) return (
        <div className="flex items-center justify-center p-8">
            <div className="text-red-500">Ошибка загрузки заказов</div>
        </div>
    )

    return (
        <div className="w-full">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    Мои заказы
                </h2>
            </div>
            <ScrollArea className={"h-[600px] sm:h-[700px]"}>
                <div className={"flex flex-col gap-4 sm:gap-6 pr-4"}>
                    {data.orders.map(order => (
                        <div 
                            key={order.id} 
                            className={
                                "flex flex-col bg-white rounded-lg border border-gray-200 " +
                                "shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            }
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                                <h3 className={"text-lg sm:text-xl font-semibold text-gray-900"}>
                                    Заказ №{order.id}
                                </h3>
                            </div>
                            
                            <div className="p-4 sm:p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-gray-500 mb-1">Имя покупателя</span>
                                            <span className="text-sm sm:text-base font-medium text-gray-900 break-words">{order.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-gray-500 mb-1">Email</span>
                                            <span className="text-sm sm:text-base font-medium text-gray-900 break-all">{order.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-gray-500 mb-1">Адрес</span>
                                            <span className="text-sm sm:text-base font-medium text-gray-900 break-words">{order.address}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-gray-500 mb-1">Телефон</span>
                                            <span className="text-sm sm:text-base font-medium text-gray-900">{order.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Truck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-gray-500 mb-1">Доставка</span>
                                            <span className="text-sm sm:text-base font-medium text-gray-900">{order.delivery}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-gray-500 mb-1">Оплата</span>
                                            <span className="text-sm sm:text-base font-medium text-gray-900">{order.pay}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="mb-3">
                                        <span className="text-sm font-medium text-gray-700">Товары в заказе:</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {order.orderItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="mb-2">
                                                            <span className="text-xs text-gray-500">Название товара</span>
                                                            <div className="mt-1">
                                                                <Link 
                                                                    className={
                                                        "text-sm sm:text-base font-medium text-blue-600 hover:text-blue-700 " +
                                                        "underline hover:no-underline transition-colors break-words"
                                                                    } 
                                                                    href={`/product/${item.productId}`}
                                                                >
                                                                    {item.productName}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-500">Размер: </span>
                                                                <span className="font-medium text-gray-900">{item.size}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Количество: </span>
                                                                <span className="font-medium text-gray-900">{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <div className="text-right">
                                                            <span className="text-xs text-gray-500 block mb-1">Цена</span>
                                                            <span className="text-base sm:text-lg font-semibold text-gray-900">
                                                                {item.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                                    <span className="text-base sm:text-lg font-semibold text-gray-700">Итого:</span>
                                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                                        {order.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}