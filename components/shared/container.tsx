import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

interface Props {
    className?: string
}

export const Container = ({ children, className }: PropsWithChildren<Props>) => {
    return (
        <div className={cn("max-w-6xl m-auto", className)}>
            {children}
        </div>
    )
}