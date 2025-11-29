'use client';

import { CldImage } from "next-cloudinary"

interface Props {
    className?: string
    src: string
    alt: string
    w: number
    h: number
}

export const ImageClient = ({ src, alt, className, w, h }: Props) => {
    return (
        <CldImage
            width={w}
            height={h}
            src={src}
            alt={alt}
            className={className}
        />
    )
}