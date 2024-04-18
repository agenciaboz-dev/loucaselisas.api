import { Prisma } from "@prisma/client"
import { Media, MediaForm } from "../Gallery/Media"
import { FileUpload, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { saveFile } from "../../tools/saveFile"

export const lesson_include = Prisma.validator<Prisma.LessonInclude>()({ media: true, user_downloads: { include: { _count: true } } })
export type LessonPrisma = Prisma.LessonGetPayload<{ include: typeof lesson_include }>
export type LessonForm = Omit<WithoutFunctions<Lesson>, "id" | "published" | "thumb" | "user_views" | "user_likes" | "user_downloads" | "active"> & {
    thumb: FileUpload
    media: MediaForm
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

    async init() {
        const data = await prisma.lesson.findUnique({ where: { id: this.id }, include: lesson_include })
        if (data) this.load(data)
    }

    load(data: LessonPrisma) {
        this.id = data.id
        this.thumb = data.thumb
        this.name = data.name
        this.pdf = data.pdf
        this.published = data.published
        this.active = data.active
        this.media = new Media(data.media)
        this.course_id = data.course_id
        this.info = data.info
        // this.user_views = data.user_views
        // this.user_likes = data.user_likes
        // this.user_downloads = data.user_downloads
    }

    async updateMedia(media: MediaForm, thumb: FileUpload) {
        this.media = await Media.update(this.media.id, media, `course/lessons/${this.course_id}`)
        const thumb_url = saveFile(`course/lessons/${this.course_id}`, thumb)
        await prisma.lesson.update({ where: { id: this.id }, data: { thumb: thumb_url } })
    }

    async update(data: Partial<LessonForm>) {
        if (data.media && data.thumb) {
            await this.updateMedia(data.media, data.thumb)
        }

        const prisma_data = await prisma.lesson.update({
            where: { id: this.id },
            data: {
                ...data,
                media: undefined,
                thumb: undefined,
            },
            include: lesson_include,
        })

        this.load(prisma_data)
    }
}
