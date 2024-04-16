import { Prisma } from "@prisma/client"
import { FileUpload } from "../helpers"

export type MediaPrisma = Prisma.MediaGetPayload<{}>
export type MediaForm = FileUpload & { type: "IMAGE" | "VIDEO"; id?: string; url?: string }

export class Media {
    id: string
    url: string

    constructor(data: MediaPrisma) {
        this.id = data.id
        this.url = data.url
    }
}
