import { Prisma } from "@prisma/client"
import { Gallery, gallery_include } from "../Gallery/Gallery"
import { Socket } from "socket.io"
import { prisma } from "../../prisma"
import { Message, message_include } from "./Message"

export const chat_include = Prisma.validator<Prisma.ChatInclude>()({
    media: { include: gallery_include },
    course: true,
    messages: true,
})
export type ChatPrisma = Prisma.ChatGetPayload<{ include: typeof chat_include }>

export class Chat {
    id: string
    description: string | null
    media: Gallery
    messages: number

    static async join(socket: Socket, chat_id: string, platform: "app" | "admin") {
        await socket.join(chat_id)
        const data = await prisma.message.findMany({ where: { chat_id, deleted: platform == "app" ? false : undefined }, include: message_include })
        const messages = data.map((item) => new Message(item))

        socket.emit("chat:join", messages)
    }

    static async deleteMessages(socket: Socket, messages: Message[], chat_id: string) {
        console.log(messages)
        const data = await prisma.chat.findFirst({ where: { id: chat_id }, include: chat_include })
        if (data) {
            const chat = new Chat(data)
            await chat.deleteMessages(socket, messages)
        }
    }

    constructor(data: ChatPrisma) {
        this.id = data.id
        this.description = data.description
        this.media = new Gallery("", data.media)
        this.messages = data.messages.filter((item) => !item.deleted).length
    }

    async deleteMessages(socket: Socket, messages: Message[]) {
        const deleted = await Promise.all(
            messages.map(async (message) => await prisma.message.update({ where: { id: message.id }, data: { deleted: true } }))
        )

        socket.emit("chat:message:delete", deleted)
        socket.to(this.id).emit("chat:message:delete", deleted)
    }
}
