import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

interface Props {
    className?: string
}

export const Container = ({ children, className }: PropsWithChildren<Props>) => {
    return (
        <div className={cn("sm:max-w-6xl px-4 m-auto sm:my-10 mt-15 mb-25", className)}>
            {children}
        </div>
    )
}