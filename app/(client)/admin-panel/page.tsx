import { Container } from "@/components/shared";
import { AdminPanelCatalog } from "@/components/shared/admin-panel-catalog";
import { AdminPanelCatalogDelete } from "@/components/shared/admin-panel-catalog-delete";
import { AdminPanelOrder } from "@/components/shared/admin-panel-order";
import { AdminPanelProductDelete } from "@/components/shared/admin-panel-product-delete";
import { AdminPanelProducts } from "@/components/shared/admin-panel-products";
import { AdminPanelRatings } from "@/components/shared/admin-panel-ratings";
import { Shield } from "lucide-react";

export default function AdminPanelPage() {
    return (
        <Container>
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Панель администратора</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Управление товарами, заказами, каталогами и отзывами</p>
            </div>
            
            <div className={"flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8 mb-6 sm:mb-8"}>
                <div className="flex-1">
                    <AdminPanelProducts />
                </div>
                <div className="w-full lg:max-w-[500px] lg:w-full">
                    <AdminPanelOrder />
                </div>
            </div>
            
            <div className="mb-6 sm:mb-8">
                <AdminPanelCatalog />
            </div>
            
            <div className="mb-6 sm:mb-8">
                <AdminPanelRatings />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminPanelProductDelete />
                <AdminPanelCatalogDelete />
            </div>
        </Container>
    )
}