import { Prisma } from "@prisma/client"
import { Media } from "../Gallery"

export const lesson_include = Prisma.validator<Prisma.LessonInclude>()({ image: true, video: true })
export type LessonPrisma = Prisma.LessonGetPayload<{ include: typeof lesson_include }>

export class Lesson {
    id: string
    published: string
    name: string
    cover: string | null

    image: Media | null
    pdf: string | null
    video_id: string | null
    video: Media | null

    constructor(data: LessonPrisma) {
        this.id = data.id
        this.cover = data.cover
        this.image = data.image
        this.name = data.name
        this.pdf = data.pdf
        this.published = data.published
        this.video = data.video
        this.video_id = data.video_id
    }
}
