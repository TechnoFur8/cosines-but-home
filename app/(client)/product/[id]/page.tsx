import { Container } from "@/components/shared";
import { ProductOption } from "@/components/shared/product-option";
import { verefyToken } from "@/lib/token";
import { cookies } from "next/headers";

export default async function ProductPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    const userToken = token?.value ? await verefyToken(token?.value) : null

    return (
        <Container className={"my-10"}>
            <ProductOption role={userToken} />
        </Container>
    )
}