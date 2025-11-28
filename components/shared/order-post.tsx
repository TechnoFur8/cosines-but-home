import { usePostOrderMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import { IMaskInput } from 'react-imask'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"
import { Button } from "../ui/button"
import { LoaderCircle } from "lucide-react"

interface Props {
    refetch: () => void
}

export const OrderPost = ({ refetch }: Props) => {
    const [postOrder, { isLoading }] = usePostOrderMutation()

    const formSchema = z.object({
        email: z.string().min(2, "Короткий email").email(),
        phone: z.string().min(18, "Короткий номер"),
        address: z.string().min(2, "Короткий адрес"),
        delivery: z.enum(["Курьером (по Москве)", "Самовывоз"]),
        pay: z.enum(["Наличными", "Переводос"]),
        policy: z.boolean().refine(el => el === true, { message: "Пользователь откланил соглашение" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            phone: "",
            address: "",
            delivery: "Курьером (по Москве)",
            pay: "Наличными",
            policy: false
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await postOrder({
                email: data.email,
                phone: data.phone,
                address: data.address,
                delivery: data.delivery,
                pay: data.pay,
                policy: data.policy
            }).unwrap()
            await refetch()
            toast.success("Спасибо за заказ! Проверьте почту", { icon: "😊" })
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Введите ваш email" type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Номер телефона</FormLabel>
                            <FormControl>
                                <IMaskInput
                                    placeholder="Введите вааш номер телефона"
                                    className={cn(
                                        "w-full px-3 py-2 rounded-md border border-gray-200",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                        "placeholder:text-gray-400 text-sm"
                                    )}
                                    mask="+7 (000) 000-00-00"
                                    {...field}
                                    type={"tel"}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ваш адресс</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Введите ваш адресс" type="text" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="delivery"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium block mb-3">Способ доставки</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    className="flex flex-col"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="Курьером (по Москве)" />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">Курьером (по Москве)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="Самовывоз" />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">Самовывоз</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pay"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium block mb-3">Способ доставки</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    className="flex flex-col"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="Наличными" />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">Наличными</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="Переводом" />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">Переводом</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="policy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Политика конфиденциальности</FormLabel>
                            <div className="flex items-start space-x-3">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="mt-1"
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                    <span>
                                        Соглашаюсь на обработку своих
                                        <Link className="text-blue-600 hover:underline pl-1" href="/personal">
                                            персональных данных
                                        </Link>
                                    </span>
                                </FormLabel>
                            </div>
                            <FormMessage className="text-xs text-red-500 mt-1" />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} className={"w-full"} type="submit">{isLoading ? <><LoaderCircle className={"animate-spin"} /> Создаем заказ</> : "Создать заказ"}</Button>
            </form>
        </Form>
    )
}