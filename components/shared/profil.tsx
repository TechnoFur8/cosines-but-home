import { ProfilOrder } from "./profil-order"
import { ProfilUser } from "./profil-user"

export const Profil = () => {
    return (
        <div className={"flex justify-between"}>
            <ProfilUser />
            <ProfilOrder />
        </div>
    )
}