import { createWriteStream, existsSync, mkdirSync } from "fs"
import { join } from "path"
import { env } from "../env"
import { FileUpload } from "../class/helpers"
import { getLocalUrl } from "./getLocalUrl"

const getBuffer = (file: FileUpload) => {
    if (file.base64) {
        return Buffer.from(file.base64, "base64")
    }

    return Buffer.from(file.file as ArrayBuffer)
}

export const saveFile = (path: string, file: FileUpload) => {
    const buffer = getBuffer(file)
    console.log({ buffer })
    const uploadDir = `static/${path}`
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, file.name)
    createWriteStream(filepath).write(buffer)

    const url = `${getLocalUrl()}/${filepath}`
    return url
}
