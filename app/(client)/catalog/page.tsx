import { Catalogs, Container } from "@/components/shared";
import { verefyToken } from "@/lib/token";
import { cookies } from "next/headers";

async function getCatalog() {
    const res = await fetch("http://localhost:3000/api/catalogs", {
        next: {revalidate: 86400}
    })

    if (!res.ok) {
        throw new Error("Ошибка обновления каталога")
    }

    return res.json()
}

export default async function CatalogPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    const userToken = token?.value ? await verefyToken(token?.value) : null

    const data = await getCatalog()

    return (
        <Container>
            <Catalogs data={data} role={userToken} />
        </Container>
    )
}