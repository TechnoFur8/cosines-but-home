import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { UserSignin } from "./user-signin"
import { UserSignup } from "./user-signup"

export const UserRegistation = () => {
    return (
        <div className={"min-w-120 mx-auto"}>
            <Tabs defaultValue="signin">
                <TabsList>
                    <TabsTrigger value="signin">Вход</TabsTrigger>
                    <TabsTrigger value="signup">Регистрация</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <UserSignin />
                </TabsContent>
                <TabsContent value="signup">
                    <UserSignup />
                </TabsContent>
            </Tabs>
        </div>
    )
}