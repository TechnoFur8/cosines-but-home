import { Container } from "@/components/shared";
import { AdminPanelCatalog } from "@/components/shared/admin-panel-catalog";
import { AdminPanelCatalogDelete } from "@/components/shared/admin-panel-catalog-delete";
import { AdminPanelOrder } from "@/components/shared/admin-panel-order";
import { AdminPanelProductDelete } from "@/components/shared/admin-panel-product-delete";
import { AdminPanelProducts } from "@/components/shared/admin-panel-products";
import { AdminPanelRatings } from "@/components/shared/admin-panel-ratings";

export default function AdminPanelPage() {
    return (
        <Container>
            <div className={"flex justify-between"}>
                <AdminPanelProducts />
                <AdminPanelOrder />
            </div>
            <AdminPanelCatalog />
            <AdminPanelRatings />
            <AdminPanelProductDelete />
            <AdminPanelCatalogDelete />
        </Container>
    )
}