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
        <div className={"w-full"}>
            <div className="mb-4 sm:mb-6">
                <h2 className={"text-xl sm:text-2xl font-semibold text-gray-900 mb-2"}>Создать каталог</h2>
                <p className="text-sm text-gray-600">Добавьте новый каталог с изображением и названием</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        <FormField
                            control={form.control}
                            name="img"
                            render={({ field }) => (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Изображение каталога</label>
                                    <Input 
                                        type="file" 
                                        accept="image/*,.png,.jpg,.web" 
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    {previewUrls && (
                                        <div className={"flex w-full sm:w-48 relative group"}>
                                            <Image 
                                                className={"object-cover rounded-lg min-h-[150px] sm:min-h-[190px] max-h-[150px] sm:max-h-[190px] w-full"} 
                                                src={previewUrls} 
                                                alt="Preview" 
                                                width={120} 
                                                height={190} 
                                            />
                                            <button 
                                                onClick={handleRemoveFile} 
                                                className={"cursor-pointer absolute right-2 top-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"}
                                            >
                                                <Trash2 className={'w-4 h-4 text-red-600'} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Название каталога</label>
                                    <Input placeholder="Введите название каталога" {...field} />
                                </div>
                            )}
                        />
                        <Button disabled={isLoading} type="submit" className="w-full sm:w-auto">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className={"animate-spin mr-2"} />
                                    Создаем каталог
                                </>
                            ) : (
                                "Создать каталог"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}