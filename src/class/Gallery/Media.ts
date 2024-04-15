import { Prisma } from "@prisma/client"

export type MediaPrisma = Prisma.MediaGetPayload<{}>

export class Media {
    id: string
    url: string

    constructor(data: MediaPrisma) {
        this.id = data.id
        this.url = data.url
    }
}
