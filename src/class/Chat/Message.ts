import { Prisma } from "@prisma/client"
import { Socket } from "socket.io"
import { FilterPrimitive, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { User } from "../User"

export const message_include = Prisma.validator<Prisma.MessageInclude>()({ user: true })
export type MessagePrisma = Prisma.MessageGetPayload<{ include: { user: true } }>

export type MessageForm = Omit<WithoutFunctions<Message>, "id" | "user" | "datetime">

export class Message {
    id: string
    text: string
    datetime: string
    user_id: string | null
    user: FilterPrimitive<User> | null

    chat_id: string

    video_id: string | null
    video_timestamp: string | null

    static async new(data: MessageForm, socket: Socket) {
        const message_prisma = await prisma.message.create({
            data: {
                datetime: new Date().getTime().toString(),
                id: uid(),
                text: data.text,
                chat_id: data.chat_id,
                user_id: data.user_id,
                video_id: data.video_id,
                video_timestamp: data.video_timestamp,
            },
            include: message_include,
        })

        const message = new Message(message_prisma)

        socket.emit("chat:message:success", message)
        socket.to(data.chat_id).emit("chat:message", message)
    }

    constructor(data: MessagePrisma) {
        this.id = data.id
        this.datetime = data.datetime
        this.text = data.text
        this.user_id = data.user_id
        this.user = data.user ? { ...data.user, liked_lessons: 0 } : null
        this.video_id = data.video_id
        this.video_timestamp = data.video_timestamp
        this.chat_id = data.chat_id
    }
}
