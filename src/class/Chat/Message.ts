import { Prisma } from "@prisma/client"
import { Socket } from "socket.io"
import { FilterPrimitive, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { User } from "../User"
import { Media, MediaForm } from "../Gallery/Media"
import { Notification } from "../Notification"
import { Course } from "../Course"

export const message_include = Prisma.validator<Prisma.MessageInclude>()({
    user: true,
    media: true,
})
export type MessagePrisma = Prisma.MessageGetPayload<{ include: typeof message_include }>

export type MessageForm = Omit<WithoutFunctions<Message>, "id" | "user" | "datetime" | "media_id" | "media" | "deleted"> & {
    media?: MediaForm
    admin?: boolean
}

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
    deleted: boolean

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

        const course = await Course.getFromChat(data.chat_id)
        if (course) {
            if (data.admin) {
                await Notification.new([
                    {
                        body: `Um administrador enviou uma mensagem no chat do curso ${course.name}. Toque aqui para acessar`,
                        target_param: { course_id: course.id },
                        target_route: "creator,creator:course:chat",
                        user_id: course.owner.user_id!,
                        expoPushToken: course.owner.user.expoPushToken,
                    },
                ])
            } else {
                const user = await User.findById(data.user_id!)
                // const users_who_liked = await Promise.all(course.favorited_by.map(async (item: { id: string }) => await User.findById(item.id)))
                await Notification.new([
                    {
                        body: `${user.username} enviou mensagem no curso ${course.name}: ${data.text || "sem texto"}`,
                        target_param: { course_id: course.id },
                        target_route: "creator,creator:course:chat",
                        user_id: course.owner.user_id!,
                        expoPushToken: course.owner.user.expoPushToken,
                    },
                    // ...users_who_liked.map((user) => ({
                    //     body: `${user.username} enviou mensagem no curso ${course.name}: ${data.text || "sem texto"}`,
                    //     expoPushToken: user.expoPushToken,
                    //     target_param: { course_id: course.id },
                    //     target_route: "chat",
                    //     user_id: user.id,
                    // })),
                ])
            }
        }
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
        this.deleted = data.deleted
    }
}
