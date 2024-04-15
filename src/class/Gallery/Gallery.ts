import { Prisma } from "@prisma/client"
import { uid } from "uid"
import { FileUpload, WithoutFunctions } from "../helpers"
import { Media } from "./Media"
import { prisma } from "../../prisma"

export const gallery_include = Prisma.validator<Prisma.GalleryInclude>()({ media: true })
export type GalleryPrisma = Prisma.GalleryGetPayload<{ include: typeof gallery_include }>

export type GalleryForm = Omit<WithoutFunctions<Gallery>, "id" | "media"> & {
    media: FileUpload[]
}

export class Gallery {
    id: string
    name: string
    media: Media[]

    constructor(data: GalleryPrisma) {
        this.id = data.id
        this.name = data.name
        this.media = data.media
    }

    static async new(data: GalleryForm) {
        const new_gallery = await prisma.gallery.create({
            data: {
                id: uid(),
                ...data,
                media: {},
            },
            include: gallery_include,
        })

        return new Gallery(new_gallery)
    }
}
