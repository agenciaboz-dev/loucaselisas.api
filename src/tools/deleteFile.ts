import { unlinkSync } from "fs"

export const deleteFile = (path: string) => {
    const filepath = `static/${path}`
    try {
        unlinkSync(filepath)
    } catch (error) {
        console.log(`failed to delete file ${filepath}`)
        console.log(error)
    }
}
