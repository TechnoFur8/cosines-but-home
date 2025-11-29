import Image from "next/image"
import { MainPageCard } from "./main-page-card"
import { MainPagePopular } from "./main-page-popular"

export const MainPage = () => {
    return (
        <>
            <div className={"relative w-full sm:h-[300px] h-50 rounded-2xl"}>
                <Image src={"/Group 70.png"} className={"object-cover rounded-2xl"} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="logo" />
                <h1 className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-center text-white sm:text-4xl text-2xl sm:w-[70%] w-full"}>Украсьте свое пространство уютными коврами</h1>
            </div>
            <MainPagePopular />
            <MainPageCard />
        </>
    )
}