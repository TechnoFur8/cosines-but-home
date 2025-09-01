"use client"

import { store } from "@/store/store"
import { PropsWithChildren } from "react"
import { Provider } from "react-redux"

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <main>
                {children}
            </main>
        </Provider>
    )
}