import { Container } from "@/components/shared";
import { UserRegistation } from "@/components/shared/user-registation";

export default function RegistrationPage() {
    return (
        <Container className={"h-[80vh] flex items-center justify-center"}>
            <UserRegistation />
        </Container>
    )
}