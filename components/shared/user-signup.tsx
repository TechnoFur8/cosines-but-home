"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff } from "lucide-react"

export const UserSignup = () => {
    const [checkPassword, setCheckPassword] = useState(false)
    const [secondCheckPassword, setSecondCheckPassword] = useState(false)

    const formSchema = z.object({
        name: z.string().min(2, "Имя не может быть короче 2 букв"),
        email: z.string().min(4, "Слишком короткий email").email(),
        password: z.string().min(6, "Слишком короткий пароль"),
        secondPassword: z.string().min(6, "Слишком короткий пароль")
    }).refine(el => el.password === el.secondPassword, {
        message: "Пароли не совпадают",
        path: ["secondPassword"]
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            secondPassword: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Зарегистрируйте аккаунт</CardTitle>
                <CardDescription>Зарегистрируйте аккаунт, что-бы пользоваться всеми возможностями магазина</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Введите ваше имя" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="secondPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Повторите пароль</FormLabel>
                                    <FormControl>
                                        <div className={"relative"}>
                                            <Input {...field} placeholder="Повторите пароль" type={secondCheckPassword ? "text" : "password"} />
                                            <button className={"absolute right-2 top-1/5"} type="button" onClick={() => setSecondCheckPassword(!secondCheckPassword)}>{secondCheckPassword ? <Eye /> : <EyeOff />}</button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Зарегистрироваться</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}