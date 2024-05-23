import { Prisma } from "@prisma/client"
import { Socket } from "socket.io"
import { FilterPrimitive, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { User } from "../User"
import { Media, MediaForm } from "../Gallery/Media"

export const message_include = Prisma.validator<Prisma.MessageInclude>()({ user: true, media: true })
export type MessagePrisma = Prisma.MessageGetPayload<{ include: typeof message_include }>

export type MessageForm = Omit<WithoutFunctions<Message>, "id" | "user" | "datetime" | "media_id" | "media"> & { media?: MediaForm }

export class Message {
    id: string
    text: string
    datetime: string
    user_id: string | null
    user: FilterPrimitive<User> | null

    chat_id: string

    video_id: string | null
    video_timestamp: string | null

    media_id: string | null
    media: Media | null

    static async new(data: MessageForm, socket: Socket) {
        let media_id: string | undefined = undefined
        if (data.media) {
            const media = await Media.new(data.media, `/chats/${data.chat_id}/${data.user_id}/`)
            media_id = media.id
        }

        const message_prisma = await prisma.message.create({
            data: {
                datetime: new Date().getTime().toString(),
                id: uid(),
                text: data.text,
                chat_id: data.chat_id,
                user_id: data.user_id,
                video_id: data.video_id,
                video_timestamp: data.video_timestamp,
                media_id,
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
        this.media_id = data.media_id
        this.media = data.media
    }
}
