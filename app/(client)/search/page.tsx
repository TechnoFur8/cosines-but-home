import { Container } from "@/components/shared";
import { SearchProducts } from "@/components/shared/search-products";

export default function SearchPage() {
    return (
        <Container className={"sm:my-10 my-15"}>
            <SearchProducts />
        </Container>
    );
}