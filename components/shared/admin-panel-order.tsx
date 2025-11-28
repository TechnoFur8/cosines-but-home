"use client"

import { useGetOrderQuery } from "@/store/apiSlice"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"

export const AdminPanelOrder = () => {
    const { data, isLoading, isError } = useGetOrderQuery()

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>

    const order = data?.orders

    const dataPublic = (component: string) => {
        let options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return new Date(component).toLocaleString("ru-RU", options)
    }

    return (
        <div className={"w-[40%]"}>
            <h2 className={"font-medium text-2xl"}>Последние заказы</h2>
            <ScrollArea className='h-266'>
                {order?.map((el) => (
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
            </ScrollArea>
        </div>
    )
}