export const selectedSize = (size: string, price: number): number => {
    const [first, last] = size.split("x").map(Number)
    return first * last * price
}