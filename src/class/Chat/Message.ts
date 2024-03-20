import { Prisma } from "@prisma/client"

export type MessagePrisma = Prisma.MessageGetPayload<{}>

export class Message {
    id: string
    text: string
    datetime: string
    user_id: string

    video_id: string | null
    video_timestamp: string | null

    constructor(data: MessagePrisma) {
        this.id = data.id
        this.datetime = data.datetime
        this.text = data.text
        this.user_id = data.user_id
        this.video_id = data.video_id
        this.video_timestamp = data.video_timestamp
    }
}
