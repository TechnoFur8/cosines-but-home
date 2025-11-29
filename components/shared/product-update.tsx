"use client"

import { Loader2, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import toast from "react-hot-toast"
import { useUpdateProductMutation } from "@/store/apiSlice"
import { Textarea } from "../ui/textarea"
import { CatalogSelect } from "./catalog-select"
import { CldImage } from "next-cloudinary"

interface Props {
    product: {
        id: number
        img: string[]
        name: string
        price: number
        discount: number
        compound: string
        warp: string
        hight: number
        hardness: number
        size: string
        description: string
        from: string
        catalogId: number
    }
}

export const ProductUpdate = ({ product }: Props) => {
    const [updateProduct, { isLoading }] = useUpdateProductMutation()
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>(product.img)

    const formSchema = z.object({
        img: z.custom<FileList>((files) => {
            if (typeof window === 'undefined') return true
            if (!files) return true
            return files instanceof FileList || (files && typeof (files as any).length === 'number')
        }, "Неверный тип файла").optional(),
        name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" }),
        price: z.coerce.number().min(1, { message: "Цена должна быть больше 0" }),
        discount: z.coerce.number(),
        compound: z.string().min(2, { message: "Состав должен быть не меньше 2 символов" }),
        warp: z.string().min(2, { message: "Основа должна быть не меньше 2 символов" }),
        hight: z.coerce.number().min(0.1, { message: "Высота должна быть больше 0.1" }),
        hardness: z.coerce.number().min(1, { message: "Твердость должна быть больше 1" }),
        size: z.string().min(2, { message: "Размер должен быть не меньше 2 символов" }),
        description: z.string().min(2, { message: "Описание должно быть не меньше 2 символов" }),
        from: z.string().min(2, { message: "Производитель должен быть не меньше 2 символов" }),
        catalogId: z.coerce.number().min(1, { message: "Категория должна быть больше 0" }),
    })

    type FormValues = {
        img?: FileList
        name: string
        price: number
        discount: number
        compound: string
        warp: string
        hight: number
        hardness: number
        size: string
        description: string
        from: string
        catalogId: number
    }

    const form = useForm<FormValues>({
        // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product.name,
            price: product.price,
            discount: product.discount,
            compound: product.compound,
            warp: product.warp,
            hight: product.hight,
            hardness: product.hardness,
            size: product.size,
            description: product.description,
            from: product.from,
            catalogId: product.catalogId || 0,
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            form.setValue("img", e.target.files)

            const files = Array.from(e.target.files)
            const urls = files.map(file => URL.createObjectURL(file))
            setPreviewUrls(prev => [...prev, ...urls])
        }
    }

    const handleRemoveNewFile = (index: number) => {
        const newUrls = [...previewUrls]
        URL.revokeObjectURL(newUrls[index])
        newUrls.splice(index, 1)
        setPreviewUrls(newUrls)

        if (form.getValues("img")) {
            const files = Array.from(form.getValues("img") as FileList) as File[]
            files.splice(index, 1)

            const dataTransfer = new DataTransfer()
            files.forEach(file => dataTransfer.items.add(file))

            form.setValue("img", dataTransfer.files)
        }
    }

    const handleRemoveExistingImage = (imageUrl: string) => {
        setDeletedImages(prev => [...prev, imageUrl])
        setExistingImages(prev => prev.filter(img => img !== imageUrl))
    }

    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData()

            formData.append('name', data.name)
            formData.append('price', String(data.price))
            formData.append('discount', String(data.discount))
            formData.append('compound', data.compound)
            formData.append('warp', data.warp)
            formData.append('hight', String(data.hight))
            formData.append('hardness', String(data.hardness))
            formData.append('size', data.size)
            formData.append('description', data.description)
            formData.append('from', data.from)
            formData.append('catalogId', String(data.catalogId))

            // Отправляем массив удаленных изображений
            if (deletedImages.length > 0) {
                formData.append('deletedImages', JSON.stringify(deletedImages))
            }

            // Добавляем новые файлы
            if (data.img && data.img.length > 0) {
                Array.from(data.img).forEach((file) => {
                    formData.append('img', file as File)
                })
            }

            await updateProduct({ formData, id: product.id }).unwrap()

            toast.success("Товар успешно обновлен")
        } catch (error) {
            toast.error("Не удалось обновить товар")
            console.error(error)
        }
    }

    return (
        <Dialog>
            <Form {...form}>
                {/* @ts-expect-error - zodResolver has issues with z.coerce.number() type inference */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogTrigger asChild>
                        <Pencil className={"absolute top-2 right-2 cursor-pointer"} size={25} fill="grey" />
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogTitle>Редактирование товара</DialogTitle>

                        <div className="space-y-4">
                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название товара</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Название товара" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Цена</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    value={field.value?.toString() ?? ""} 
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                    name="discount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Бывшая цена</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    value={field.value?.toString() ?? ""} 
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="compound"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Состав</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="warp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Основа</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                    name="hight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Высота</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    value={field.value?.toString() ?? ""} 
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                    name="hardness"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Плотность</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    value={field.value?.toString() ?? ""} 
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Размер</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Описание</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="from"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Производитель</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                name="catalogId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Категория</FormLabel>
                                        <FormControl>
                                            <CatalogSelect
                                                value={field.value?.toString()}
                                                onChange={(value) => field.onChange(Number(value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Текущие изображения:</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {existingImages.map((img, index) => (
                                            <div key={index} className="relative">
                                                <CldImage
                                                    src={img}
                                                    alt={`Current ${index}`}
                                                    width={100}
                                                    height={100}
                                                    className="w-24 h-24 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(img)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <FormField
                                    // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
                                control={form.control}
                                    name="img"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Новые изображения</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    {previewUrls.length > 0 && (
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {previewUrls.map((url, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        src={url}
                                                                        alt={`Preview ${index}`}
                                                                        className="w-24 h-24 object-cover rounded border"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveNewFile(index)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            handleFileChange(e)
                                                            field.onChange(e.target.files)
                                                        }}
                                                        ref={field.ref}
                                                    />
                                                    <p className="text-sm text-gray-500">
                                                        Можно добавить несколько изображений
                                                    </p>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Отмена</Button>
                            </DialogClose>
                            <Button 
                                type="button" 
                                // @ts-expect-error - zodResolver has issues with z.coerce.number() type inference
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

