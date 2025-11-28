"use client"

import { useGetUserOrderQuery } from "@/store/apiSlice"
import Link from "next/link"
import { ScrollArea } from "../ui/scroll-area"

export const ProfilOrder = () => {
    const { data, isLoading, isError } = useGetUserOrderQuery()

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (data?.orders.length === 0) return <h1>Нет заказов</h1>
    if (!data) return <h1>Ошибка загрузки заказов</h1>

    return (
        <ScrollArea className={"h-250 "}>
            <div className={"flex flex-col space-y-5 p-5 w-full"}>
                {data.orders.map(el => (
                    <div key={el.id} className={"flex flex-col shadow border border-zinc-200"}>
                        <h3 className={"text-2xl font-semibold"}>Заказ №{el.id}</h3>
                        <span>Имя покупателя: {el.name}</span>
                        <span>Email покупателя: {el.email}</span>
                        <span>Адресс покупателя: {el.address}</span>
                        <span>Номер телефона: {el.phone}</span>
                        <span>Доставка: {el.delivery}</span>
                        <span>Оплата: {el.pay}</span>
                        <span>Итого: {el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                        <div className="flex flex-col space-y-5 pt-2 shadow">
                            {el.orderItems.map(el => (
                                <div key={el.id} className="flex flex-col pl-10">
                                    <span>Название товара: <Link className={"underline text-blue-500"} href={`/product/${el.productId}`}>{el.productName}</Link></span>
                                    <span>Размер: {el.size}</span>
                                    <span>Количество: {el.quantity}</span>
                                    <span>Итого за товар: {el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div >
        </ScrollArea>
    )
}