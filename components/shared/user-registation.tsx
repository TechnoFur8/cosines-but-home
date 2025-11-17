import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { UserSignin } from "./user-signin"

export const UserRegistation = () => {
    return (
        <div className={"max-w-120 mx-auto mt-[30%]"}>
            <Tabs defaultValue="signin">
                <TabsList>
                    <TabsTrigger value="signin">Вход</TabsTrigger>
                    <TabsTrigger value="signup">Регистрация</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <UserSignin />
                </TabsContent>
            </Tabs>
        </div>
    )
}