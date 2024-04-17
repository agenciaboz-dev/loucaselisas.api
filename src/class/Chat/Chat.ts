import { Prisma } from "@prisma/client"
import { Gallery, gallery_include } from "../Gallery/Gallery"
import { Message } from "./Message"

export const chat_include = Prisma.validator<Prisma.ChatInclude>()({ media: { include: gallery_include }, messages: true })
export type ChatPrisma = Prisma.ChatGetPayload<{ include: typeof chat_include }>

export class Chat {
    id: string
    description: string | null
    media: Gallery
    messages: Message[]

    constructor(data: ChatPrisma) {
        this.id = data.id
        this.description = data.description
        this.media = new Gallery("", data.media)
        this.messages = data.messages
    }
}
