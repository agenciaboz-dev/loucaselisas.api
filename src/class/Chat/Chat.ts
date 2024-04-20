import { Prisma } from "@prisma/client"
import { Gallery, gallery_include } from "../Gallery/Gallery"
import { Socket } from "socket.io"
import { prisma } from "../../prisma"
import { Message, message_include } from "./Message"

export const chat_include = Prisma.validator<Prisma.ChatInclude>()({ media: { include: gallery_include }, _count: { select: { messages: true } } })
export type ChatPrisma = Prisma.ChatGetPayload<{ include: typeof chat_include }>

export class Chat {
    id: string
    description: string | null
    media: Gallery
    messages: number

    static async join(chat_id: string, socket: Socket) {
        await socket.join(chat_id)
        const data = await prisma.message.findMany({ where: { chat_id }, include: message_include })
        const messages = data.map((item) => new Message(item))

        socket.emit("chat:join", messages)
    }

    constructor(data: ChatPrisma) {
        this.id = data.id
        this.description = data.description
        this.media = new Gallery("", data.media)
        this.messages = data._count.messages
    }
}
