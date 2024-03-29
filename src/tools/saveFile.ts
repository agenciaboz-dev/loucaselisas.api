import { createWriteStream, existsSync, mkdirSync } from "fs"
import { join } from "path"
import { env } from "../env"

export const saveFile = (path: string, file: { file: ArrayBuffer | File; name: string }) => {
    const buffer = Buffer.from(file.file as ArrayBuffer)
    const uploadDir = `static/${path}`
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, file.name)
    createWriteStream(filepath).write(buffer)

    const port = process.env.PORT
    const url = `${env == "dev" ? `http://localhost:${port}` : `https://app.agencyboz.com:${port}`}/${filepath}`
    console.log(url)
    return url
}
