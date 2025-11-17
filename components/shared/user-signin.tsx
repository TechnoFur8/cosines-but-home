"use client"

import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"

export const UserSignin = () => {
    const [checkPassword, setCheckPassword] = useState(false)

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Войдите в аккаунт</CardTitle>
                <CardDescription>Войдите в аккаунт, что-бы пользоваться всеми возможностями магазина</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className={"space-y-3"}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Введите email" type="email" />
                                    </FormControl>
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
                                            <button className={"absolute right-2"} type="button" onClick={() => setCheckPassword(!checkPassword)}>{checkPassword ? <Eye /> : <EyeOff />}</button>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Войти</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}