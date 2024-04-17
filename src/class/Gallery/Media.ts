import { Prisma } from "@prisma/client"
import { FileUpload, WithoutFunctions } from "../helpers"

export type MediaPrisma = Prisma.MediaGetPayload<{}>
export type MediaForm = FileUpload &
    Omit<WithoutFunctions<Partial<Media>>, "position" | "height" | "width" | "type"> & {
        position: number
        width: number
        height: number
        type: "IMAGE" | "VIDEO"
    }

export class Media {
    id: string
    url: string
    type: "IMAGE" | "VIDEO"
    position: number
    width: number
    height: number

    constructor(data: MediaPrisma) {
        this.id = data.id
        this.url = data.url
        this.type = data.type
        this.position = data.position
        this.width = data.width
        this.height = data.height
    }
}
