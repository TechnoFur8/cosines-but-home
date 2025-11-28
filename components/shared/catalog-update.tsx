"use client"

import { Loader2, Pencil } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import toast from "react-hot-toast"
import { useUpdateCatalogMutation } from "@/store/apiSlice"

interface Props {
    isId: number
    isName: string
    isImg: string
}

export const CatalogUpdate = ({ isName, isImg, isId }: Props) => {
    const [updateCatalog, { isLoading }] = useUpdateCatalogMutation()
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [hasNewImage, setHasNewImage] = useState(false)

    const formSchema = z.object({
        img: z.custom<FileList>((files) => {
            if (typeof window === 'undefined') return true
            if (!files) return true 
            return files instanceof FileList || (files && typeof (files as any).length === 'number')
        }, "Неверный тип файла").optional(),
        name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: isName,
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(e.target.files[0])

            form.setValue("img", dataTransfer.files)
            setHasNewImage(true)

            const url = URL.createObjectURL(e.target.files[0])
            setPreviewUrls([url])
        }
    }

    const handleRemoveFile = () => {
        if (previewUrls.length > 0) {
            URL.revokeObjectURL(previewUrls[0])
            setPreviewUrls([])
            form.setValue("img", undefined)
            setHasNewImage(false)
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            formData.append('name', data.name)
            formData.append('id', String(isId))

            // Добавляем новый файл только если он был выбран
            if (hasNewImage && data.img && data.img.length > 0) {
                formData.append('img', data.img[0] as File)
            }

            await updateCatalog({ formData, id: isId }).unwrap()

            toast.success("Каталог успешно обновлен")
        } catch (error) {
            toast.error("Не удалось обновить каталог")
            console.error(error)
        }
    }

    return (
        <Dialog>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogTrigger asChild>
                        <Pencil className={"absolute top-2 right-2"} size={25} fill="grey" />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Редактирование каталога</DialogTitle>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Название товара" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Текущее изображение:</p>
                                <img
                                    src={isImg}
                                    alt="Current"
                                    className="w-32 h-32 object-cover rounded border"
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="img"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {previewUrls.map((url, index) => (
                                                    <div key={index} className="relative">
                                                        <p className="text-sm font-medium mb-2">Новое изображение:</p>
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index}`}
                                                            className="w-32 h-32 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveFile}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleFileChange(e)
                                                        field.onChange(e.target.files)
                                                    }}
                                                    ref={field.ref}
                                                />
                                                <p className="text-sm text-gray-500">
                                                    {hasNewImage
                                                        ? "Загружено новое изображение"
                                                        : "Оставьте пустым, чтобы сохранить текущее изображение"
                                                    }
                                                </p>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Отмена</Button>
                            </DialogClose>
                            <Button 
                                type="button" 
                                onClick={form.handleSubmit(onSubmit)} 
                                disabled={isLoading}
                            >
                                {isLoading ? <><Loader2 className="animate-spin" /> Обновляем</> : "Обновить"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    )
}