import { Container } from "@/components/shared";
import { ProductOption } from "@/components/shared/product-option";
import { verefyToken } from "@/lib/token";
import { Metadata, ResolvingMetadata } from "next";
import { cookies } from "next/headers";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

async function getProduct(id: number) {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        next: { revalidate: 10800 }
    })

    if (!res.ok) {
        throw new Error("Продукт не найден")
    }

    return res.json()
}

export async function generateMetadata(
    { params }: ProductPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const product = await getProduct(Number(resolvedParams.id))
    const previousImages = (await parent).openGraph?.images || []

    const keywords = [
        'ковер',
        'купить ковер',
        'ковры в Москве',
        'ковер Садовод',
        `ковер ${product.size}`,
        `ковер из ${product.from}`,
        product.name,
        'ковролин',
        'дорожка ковровая'
    ]

    const description = `Ковер "${product.name}" ${product.size}. Производство: ${product.from}. Состав: ${product.compound}. Плотность: ${product.hardness}/10. Цена ${product.price.toLocaleString('ru-RU')} ₽. В наличии на рынке Садовод в Москве. ${product.description}`

    const title = `Ковер "${product.name}" ${product.size} - Купить на рынке Садовод, Москва`

    return {
        title: title,
        description: description,
        keywords: keywords,
        openGraph: {
            title: title,
            description: description,
            images: product.img.length > 0 ? [product.img[0], ...previousImages] : [],
            url: `/products/${resolvedParams.id}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: product.img.length > 0 ? [product.img[0]] : [],
        },
        alternates: {
            canonical: `/products/${resolvedParams.id}`,
        },
        robots: {
            index: true,
            follow: true,
        }
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    const productId = await params

    const userToken = token?.value ? await verefyToken(token?.value) : null

    const data = await getProduct(Number(productId.id))

    return (
        <Container>
            <ProductOption role={userToken} data={data} />
        </Container>
    )
}