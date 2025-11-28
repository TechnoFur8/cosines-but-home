import { LoaderCircle, Star, Trash2 } from "lucide-react"
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
import toast from "react-hot-toast"

interface Props {
    productId: number
}

export const RatingPost = ({ productId }: Props) => {
    const [starNumber, setStarNumber] = useState(0)
    const [postRating, { isLoading }] = usePostRatingMutation()

    const handleStarClick = (rating: number) => {
        setStarNumber(rating)
        form.setValue('rating', rating)
    }

    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={"cursor-pointer"}
                    onClick={() => handleStarClick(i)}
                >
                    <Star fill={i <= starNumber ? "#ffa500" : "#d1d1d1"}
                        color={i <= starNumber ? "#ffa500" : "#d1d1d1"} />
                </span>
            )
        }
        return stars
    }

    const formSchema = z.object({
        rating: z.number().min(1, { message: "Рейтинг должен быть больше 1" }).max(5, { message: "Рейтинг должен быть меньше 5" }),
        description: z.string().max(1000, { message: "Описание должно быть меньше 1000 символов" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: starNumber,
            description: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await postRating({ id: productId, rating: { description: data.description, ratingStar: data.rating } }).unwrap()
            toast.success("Отзыв успешно создан")
            form.reset()
            setStarNumber(0)
        } catch (err) {
            console.error(err)
            toast.error("Не смогли создать отзыв")
        }
    }

    return (
        <div className={"mt-4"}>
            <Form {...form}>
                <form className={"space-y-3"} onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Рейтинг</FormLabel>
                                <FormControl>
                                    <div className={"flex"}>
                                        {renderStars()}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ваш отзыв</FormLabel>
                                <FormControl>
                                    <div>
                                        <Textarea {...field} placeholder="Оставьте свой отзыв" className={"h-30 resize-none"} />
                                        <span className={field.value.length > 1000 ? "text-red-500" : ""}>{field.value.length}/1000</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className={"flex justify-end"} >
                        <Button type="submit" disabled={isLoading}>{isLoading ? <><LoaderCircle className={"animate-spin"} /> Создаем отзыв </> : "Отправить отзыв"}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}