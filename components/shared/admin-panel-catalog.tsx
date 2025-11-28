"use client"

import { usePostCatalogMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import { Form, FormField } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { LoaderCircle, Trash2 } from "lucide-react"
import Image from "next/image"

export const AdminPanelCatalog = () => {
    const [postCatalog, { isLoading }] = usePostCatalogMutation()
    const [previewUrls, setPreviewUrls] = useState<string | null>(null)

    const formSchema = z.object({
        img: z.instanceof(File)
            .refine(file => file.size > 0, "Файл не должен быть пустым")
            .refine(file => file.size <= 5_000_000, "Файл должен быть меньше 5MB")
            .optional(),
        name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            img: undefined,
            name: "",
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            form.setValue("img", file)

            const url = URL.createObjectURL(file)
            setPreviewUrls(url)
        }
    }

    const handleRemoveFile = () => {
        if (previewUrls) {
            URL.revokeObjectURL(previewUrls)
            setPreviewUrls(null)
        }
        form.setValue("img", undefined)
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            if (data.img) {
                formData.append("img", data.img)
            }
            formData.append("name", data.name)

            await postCatalog(formData).unwrap()

            form.reset()
            setPreviewUrls(null)

            toast.success("Каталог успешно создан")
        } catch (err) {
            toast.error("Не удалось создать каталог")
            console.error(err)
        }
    }

    return (
        <div className={"mt-20"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="img"
                        render={({ field }) => (
                            <div>
                                <Input type="file" accept="image/*,.png,.jpg,.web" onChange={handleFileChange} />
                                {previewUrls &&
                                    <div className={"flex w-30 relative"}>
                                        <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={previewUrls} alt="asd" width={120} height={190} />
                                        <button onClick={handleRemoveFile} className={"cursor-pointer absolute right-1 top-1"}>
                                            <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                        </button>
                                    </div>
                                }
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <Input placeholder="Название каталога" {...field} />
                        )}
                    />
                    <Button disabled={isLoading} type="submit">{isLoading ? <><LoaderCircle className={"animate-spin"} /> Создаем</> : "Создать"}</Button>
                </form>
            </Form>
        </div>
    )
}