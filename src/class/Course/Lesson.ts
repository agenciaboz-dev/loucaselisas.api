import { Prisma } from "@prisma/client"
import { Media } from "../Gallery/Media"
import { FileUpload, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { saveFile } from "../../tools/saveFile"

export const lesson_include = Prisma.validator<Prisma.LessonInclude>()({ media: true, user_downloads: { include: { _count: true } } })
export type LessonPrisma = Prisma.LessonGetPayload<{ include: typeof lesson_include }>
export type LessonForm = Omit<WithoutFunctions<Lesson>, "id" | "published" | "thumb" | "user_views" | "user_likes" | "user_downloads" | "active"> & {
    thumb: FileUpload
    media: FileUpload
}

export class Lesson {
    id: string
    published: string
    name: string
    thumb: string | null
    info: string
    active: boolean
    media: Media
    user_views: number
    user_likes: number
    user_downloads: number
    course_id: string

    pdf: string | null

    static async new(data: LessonForm) {
        const media = await Media.new(data.media, `course/lessons/${data.course_id}`)
        const thumb_url = saveFile(`course/lessons/${data.course_id}`, data.thumb)

        const lesson_prisma = await prisma.lesson.create({
            data: {
                ...data,
                id: uid(),
                published: new Date().getTime().toString(),
                media: undefined,
                media_id: media.id,
                thumb: thumb_url,
            },
            include: lesson_include,
        })

        const lesson = new Lesson("", lesson_prisma)
        return lesson
    }

    constructor(id: string, data?: LessonPrisma) {
        this.id = id
        if (data) this.load(data)
    }

    load(data: LessonPrisma) {
        this.id = data.id
        this.thumb = data.thumb
        this.name = data.name
        this.pdf = data.pdf
        this.published = data.published
        this.active = data.active
        this.media = data.media
        this.course_id = data.course_id
        this.info = data.info
        // this.user_views = data.user_views
        // this.user_likes = data.user_likes
        // this.user_downloads = data.user_downloads
    }
}
