import { Prisma } from "@prisma/client"
import { uid } from "uid"
import { FileUpload, WithoutFunctions } from "../helpers"
import { Media, MediaForm } from "./Media"
import { prisma } from "../../prisma"
import { saveFile } from "../../tools/saveFile"
import { deleteFile } from "../../tools/deleteFile"

export const gallery_include = Prisma.validator<Prisma.GalleryInclude>()({ media: true })
export type GalleryPrisma = Prisma.GalleryGetPayload<{ include: typeof gallery_include }>

export type GalleryForm = Omit<WithoutFunctions<Gallery>, "id" | "media"> & {
    id?: string
    media: MediaForm[]
}

export class Gallery {
    id: string
    name: string
    media: Media[]

    constructor(id: string, data?: GalleryPrisma) {
        this.id = id
        if (data) this.load(data)
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

        const gallery = new Gallery("", new_gallery)

        if (gallery.media) {
            await gallery.updateMedia(data.media)
        }

        return gallery
    }

    async init() {
        const data = await prisma.gallery.findUnique({ where: { id: this.id }, include: gallery_include })
        if (data) this.load(data)
    }

    load(data: GalleryPrisma) {
        this.id = data.id
        this.name = data.name
        this.media = data.media
    }

    async updateMedia(list: MediaForm[]) {
        const new_media_list = list
            .filter((item) => !item.id)
            .map((item) => {
                const url = saveFile(`/galleries/`, item)

                return { ...item, url }
            })

        const keep_media_list = list.filter((item) => !!item.id && !!item.url)

        await prisma.gallery.update({
            where: { id: this.id },
            data: {
                media: {
                    deleteMany: { gallery_id: this.id },
                    create: keep_media_list.map((item) => ({
                        id: item.id!,
                        type: item.type,
                        url: item.url!,
                        position: item.position,
                        height: item.height,
                        width: item.width,
                    })),
                },
            },
        })
        const updated_gallery = await prisma.gallery.update({
            where: { id: this.id },
            data: {
                media: {
                    create: new_media_list.map((item) => ({
                        id: uid(),
                        type: item.type,
                        url: item.url,
                        position: item.position,
                        height: item.height,
                        width: item.width,
                    })),
                },
            },
            include: gallery_include,
        })

        this.load(updated_gallery)
    }
}
