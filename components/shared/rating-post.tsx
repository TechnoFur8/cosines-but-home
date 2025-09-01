import { SendHorizonal, Star, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useGetMyRatingQuery, usePostRatingMutation } from "@/store/apiSlice"
import { Input } from "../ui/input"
import React, { useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface Props {
    productId: number
}

export const RatingPost = ({ productId }: Props) => {
    const [img, setImg] = useState<File[]>([])
    const [starNumber, setStarNumber] = useState(0)
    const { data, isLoading, isError } = useGetMyRatingQuery(productId)
    const ref = useRef<HTMLInputElement>(null)
    const [postRating, { isLoading: isLoadingRating }] = usePostRatingMutation()

    const formSchema = z.object({
        img,
        name: z.string().min(2, { message: "Минимум 2 символа" }),
        text: z.string(),
        rating: z.number().min(1).max(5)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            img,
            name: "",
            text: "",
            rating: starNumber
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            formData.append("name", data.name)
            formData.append("text", data.text)
            formData.append("rating", data.rating.toString())
            formData.append("productId", productId.toString())
            formData.append("rating", data.rating.toString())

            await postRating({ id: productId, rating: formData }).unwrap()

            form.reset()
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <h1>Error</h1>
    if (!data) return <h1>Ошибка загрузки рейтинга</h1>

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && img.length + e.target.files.length <= 10) {
            const newArray = Array.from(e.target.files)
            setImg([...img, ...newArray])
        } else {
            alert("Вы можете загрузить не более 10 фотографий")
        }
    }

    let defaultStar = 5 - starNumber

    let starArray = []
    let starDefaultArray = []

    for (let i = 0; i < starNumber; i++) {
        starArray.push(<Star fill="#ffa500" color="#ffa500" />)
    }

    for (let i = 0; i < defaultStar; i++) {
        starDefaultArray.push(<Star fill="#d1d1d1" color="#d1d1d1" />)
    }

    return (
        <>
            {data.rating === null ?
                <>
                    <h2 className={"text-2xl font-semibold"}>Оставьте свой отзыв</h2>
                    <div>

                    </div>
                    <div className={"flex items-end flex-col gap-y-3"}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Рейтинг</FormLabel>
                                            <FormControl>
                                                <div className={"flex"}>
                                                    {starArray.map((el, i) => (
                                                        <span className={"cursor-pointer"} onClick={() => {setStarNumber(i + 1), field.onChange(console.log(i + 1))}} key={i}>{el}</span>
                                                    ))}
                                                    {starDefaultArray.map((el, i) => (
                                                        <span className={"cursor-pointer"} onClick={() => setStarNumber(starNumber + i + 1)} key={i}>{el}</span>
                                                    ))}
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ваше имя</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Ваше имя" type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ваш отзыв</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Оставьте свой отзыв" className={"h-30 resize-none"} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={img.length >= 10} className={"w-full"} onClick={() => ref.current?.click()}>Выбрать Фотографии</Button>
                                <Input className={"hidden"} ref={ref} type="file" accept="image/*" multiple onChange={handleFileChange} />
                                <Button>Отправить <SendHorizonal /></Button>
                            </form>
                        </Form>
                    </div>
                    <div className={"grid grid-cols-5 grid-rows-2 gap-6"}>
                        {img.map((item, index) => (
                            <div key={index} className={"w-full max-h-80 flex items-center justify-center"}>
                                <div className={"relative"}>
                                    <div className={"w-full h-full"}>
                                        <CldImage className={"w-full max-h-80"} src={URL.createObjectURL(item)} alt={item.name} width={500} height={500} />
                                    </div>
                                    <button className={"absolute text-gray-600 top-1 right-1 z-100 cursor-pointer hover:text-red-500 transition delay-100 duration-300"} onClick={() => setImg(img.filter(el => el.name !== item.name))} ><Trash2 fill="white" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                :
                <div>
                    <span>{data.rating?.name}</span>
                    <p>{data.rating?.description}</p>
                </div>
            }
        </>
    )
}