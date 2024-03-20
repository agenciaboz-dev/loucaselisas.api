import { Prisma } from "@prisma/client"
import { uid } from "uid"
import { FileUpload, WithoutFunctions } from "../helpers"
import { Media } from "./Media"
import { prisma } from "../../prisma"

export const gallery_include = Prisma.validator<Prisma.GalleryInclude>()({ images: true, videos: true })
export type GalleryPrisma = Prisma.GalleryGetPayload<{ include: typeof gallery_include }>

export type GalleryForm = Omit<WithoutFunctions<Gallery>, "id" | "images" | "videos"> & {
    images: FileUpload[]
    videos: FileUpload[]
}

export class Gallery {
    id: string
    name: string
    images: Media[]
    videos: Media[]

    constructor(data: GalleryPrisma) {
        this.id = data.id
        this.name = data.name
        this.images = data.images
        this.videos = data.videos
    }

    static async new(data: GalleryForm) {
        const new_gallery = await prisma.gallery.create({
            data: {
                id: uid(),
                ...data,
                images: {},
                videos: {},
            },
            include: gallery_include,
        })

        return new Gallery(new_gallery)
    }
}
