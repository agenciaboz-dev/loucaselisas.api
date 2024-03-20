import { Prisma } from "@prisma/client"

export const gallery_include = Prisma.validator<Prisma.GalleryInclude>()({ images: true, videos: true })
export type GalleryPrisma = Prisma.GalleryGetPayload<{ include: typeof gallery_include }>

export class Media {
    id: string
    url: string
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
}
