import { Catalog, Container } from "@/components/shared";
import { verefyToken } from "@/lib/token";
import { cookies } from "next/headers";

export default async function CatalogPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    const userToken = token?.value ? await verefyToken(token?.value) : null

    return (
        <Container className={"my-10"}>
            <Catalog role={userToken} />
        </Container>
    )
}