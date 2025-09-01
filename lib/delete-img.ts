import cloudinary from "./cloudinary"

export async function deleteMultipleImg(url: string[]) {
    try {
        const publicId = url.map(el => el.split("/").slice(-1).join("").split(".")[0])
        const result = await cloudinary.api.delete_resources(publicId)
        return result
    } catch (err) {
        console.error(err)
    }
}