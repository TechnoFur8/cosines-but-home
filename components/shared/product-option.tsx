"use client"

import { useGetProductOneQuery } from "@/store/apiSlice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { useState } from "react";
import { Check } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react'
import { CldImage } from "next-cloudinary";
import { Pagination, Navigation } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { selectedSize } from "@/lib/selected-size";
import { CartPost } from "./cart-post";
import { RatingCharacter } from "./rating-character";

export const ProductOption = () => {
    const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null)
    const [selectedSizeElement, setSelectedSizeElement] = useState<string>("")

    const { id } = useParams()
    const { data, isLoading, isError } = useGetProductOneQuery(Number(id))

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки товара</h1>


    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            Главная
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            Информация о товар
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"mt-4"}>
                <Swiper pagination={{ type: "progressbar" }} slidesPerView={2} spaceBetween={20} modules={[Pagination, Navigation]} navigation={true}>
                    {data.img.map((el, i) => (
                        <SwiperSlide key={i}>
                            <CldImage className={"max-w-full max-h-[500px] object-cover mx-auto my-3"} src={el} alt={data.name} width={500} height={500} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className={"space-y-4"}>
                <h1 className={"text-4xl font-bold"}>{data.name}</h1>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className={"text-2xl font-semibold"}>Описание</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-[16px]">{data.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <h3 className={"text-2xl font-semibold"}>Выберите размер</h3>
                <div className={"space-x-3 space-y-2"}>
                    {data.size.split(" ").map((el, i) =>
                        <Button
                            onClick={() => { setSelectedSizeIndex(i), setSelectedSizeElement(el) }}
                            className={"cursor-pointer shadow rounded-sm rounded-black-900 relative"}
                            variant={selectedSizeIndex === i ? "default" : "secondary"} key={i}
                        >
                            {el} {selectedSizeIndex === i && <Check className={"absolute font-bold top-0.5 right-0.5 size-3"} />}
                        </Button>
                    )}
                </div>
                <h3 className={"text-2xl font-semibold"}>Цена</h3>
                <div className={"flex flex-col"}>
                    <span className={"text-[18px]"}>{selectedSizeElement.length === 0 ? data.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 }) : selectedSize(selectedSizeElement, data.price).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    <span className={"text-[#737373] text-sm line-through"}>{selectedSizeElement.length === 0 ? data.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 }) : selectedSize(selectedSizeElement, data.discount).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                </div>
                <CartPost productId={data.id} size={selectedSizeElement} />
                <h3 className={"text-2xl font-semibold"}>Характеристики</h3>
                <div>
                    <div className={"w-full h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex py-4"}>
                        <div className={"flex flex-col w-[50%]"}>
                            <span className={"text-[#737373]"}>Состав</span>
                            <span>{data.compound}</span>
                        </div>
                        <div className={"flex flex-col"}>
                            <span className={"text-[#737373]"}>Основа</span>
                            <span>{data.warp}</span>
                        </div>
                    </div>
                    <div className={"w-full h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex py-4"}>
                        <div className={"flex flex-col w-[50%]"}>
                            <span className={"text-[#737373]"}>Высота ворса</span>
                            <span>{data.hight} мм</span>
                        </div>
                        <div className={"flex flex-col"}>
                            <span className={"text-[#737373]"}>Плотность</span>
                            <span>{data.hardness}</span>
                        </div>
                    </div>
                    <div className={"w-full h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex flex-col py-4"}>
                        <span className={"text-[#737373]"}>Произдводитель</span>
                        <span>{data.from}</span>
                    </div>
                </div>
            </div>
            <RatingCharacter productId={Number(id)} />
        </div>
    )
}