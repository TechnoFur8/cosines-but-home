"use client"

import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"
import { useSigninUserMutation } from "@/store/apiSlice"
import toast from "react-hot-toast"

export const UserSignin = () => {
    const [postUser, { isLoading }] = useSigninUserMutation()
    const [checkPassword, setCheckPassword] = useState(false)

    const formSchema = z.object({
        email: z.string().min(2, "Короткий email").email(),
        password: z.string().min(6, "Короткий пароль")
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await postUser({ email: data.email, password: data.password }).unwrap()
            toast.success("Успешный вход")
        } catch (err) {
            console.error(err)
            toast.error("Произошла ошибка")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Войдите в аккаунт</CardTitle>
                <CardDescription>Войдите в аккаунт, что-бы пользоваться всеми возможностями магазина</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Введите email" type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <div className={"relative"}>
                                            <Input {...field} placeholder="Введите пароль" type={checkPassword ? "text" : "password"} />
                                            <button className={"absolute right-2 top-1/5"} type="button" onClick={() => setCheckPassword(!checkPassword)}>{checkPassword ? <Eye /> : <EyeOff />}</button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoading} type="submit">Войти</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}