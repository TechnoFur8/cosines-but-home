import { ProfilOrder } from "./profil-order"
import { ProfilUser } from "./profil-user"

export const Profil = () => {
    return (
        <div className={"flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8"}>
            <div className={"w-full lg:max-w-[350px] lg:w-full"}>
                <ProfilUser />
            </div>
            <div className={"flex-1 min-w-0"}>
                <ProfilOrder />
            </div>
        </div>
    )
}