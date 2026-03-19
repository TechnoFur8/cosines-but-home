import { Catalogs, Container } from "@/components/shared";
import { verefyToken } from "@/lib/token";
import { Metadata } from "next";
import { cookies } from "next/headers";

async function getCatalog() {
    const res = await fetch("http://localhost:3000/api/catalogs", {
        next: { revalidate: 86400 }
    })

    if (!res.ok) {
        throw new Error("Ошибка обновления каталога")
    }

    return res.json()
}

export const metadata: Metadata = {
    title: "Каталог ковров и ковровых дорожек - Магазин на рынке Садовод",
    description: "Полный каталог ковров и ковровых дорожек в Москве на рынке Садовод. Натуральные и синтетические ковры всех размеров. Низкие цены от производителя. Доставка по России.",
    keywords: [
        "каталог ковров",
        "ковры Садовод каталог",
        "ковровые дорожки каталог",
        "купить ковер в Москве каталог",
        "ковры все размеры",
        "натуральные ковры каталог",
        "синтетические ковры",
        "ковры цена каталог"
    ],
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