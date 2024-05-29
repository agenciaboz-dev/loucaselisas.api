import { Prisma } from "@prisma/client"
import { FileUpload, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { saveFile } from "../../tools/saveFile"

export type MediaPrisma = Prisma.MediaGetPayload<{}>
export type MediaForm = FileUpload &
    Omit<WithoutFunctions<Partial<Media>>, "position" | "height" | "width" | "type" | "duration"> & {
        position: number
        width: number
        height: number
        type: "image" | "video"
        duration?: number
    }

export class Media {
    id: string
    url: string
    duration: number
    type: "image" | "video"
    position: number
    width: number
    height: number

    static async new(data: MediaForm, pathdir: string) {
        const url = saveFile(pathdir, data)
        const media_prisma = await prisma.media.create({
            data: {
                type: data.type,
                position: data.position,
                width: data.width,
                height: data.height,
                duration: data.duration,
                id: uid(),
                url,
            },
        })

        const media = new Media(media_prisma)
        return media
    }

    static async update(id: string, data: MediaForm, pathdir: string) {
        const url = saveFile(pathdir, data)
        const media_prisma = await prisma.media.update({
            where: { id },
            data: {
                height: data.height,
                position: data.position,
                type: data.type,
                width: data.width,
                duration: data.duration,
                url,
            },
        })

        const media = new Media(media_prisma)
        return media
    }

    constructor(data: MediaPrisma) {
        this.id = data.id
        this.url = data.url
        this.type = data.type
        this.position = data.position
        this.width = data.width
        this.height = data.height
        this.duration = data.duration
    }
}
