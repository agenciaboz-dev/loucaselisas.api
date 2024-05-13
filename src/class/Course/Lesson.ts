import { Prisma } from "@prisma/client"
import { Media, MediaForm } from "../Gallery/Media"
import { FileUpload, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { saveFile } from "../../tools/saveFile"
import { Status } from "../Course"

export const lesson_include = Prisma.validator<Prisma.LessonInclude>()({
    media: true,
    likes: true,
    course: true,
    _count: { select: { downloads: true, likes: true, views: true } },
})
export type LessonPrisma = Prisma.LessonGetPayload<{ include: typeof lesson_include }>
export type LessonForm = Omit<
    WithoutFunctions<Lesson>,
    "id" | "published" | "thumb" | "views" | "likes" | "downloads" | "active" | "course" | "favorited_by" | "media" | "declined_reason" | "status"
> & {
    thumb?: FileUpload
    media?: MediaForm
    declined_reason?: string
}
export type PartialLesson = Partial<Lesson> & { id: string }

export class Lesson {
    id: string
    published: string
    name: string
    thumb: string | null
    info: string
    media: Media
    views: number
    likes: number
    downloads: number
    course_id: string
    course: any
    favorited_by: { id: string }[]

    pdf: string | null
    status: Status
    declined_reason: string | null

    static async new(data: LessonForm) {
        if (!data.media) throw "media required"
        if (!data.thumb) throw "thumb required"

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

    static async list() {
        const data = await prisma.lesson.findMany({ include: lesson_include })
        const lessons = data.map((item) => new Lesson("", item))
        return lessons
    }

    constructor(id: string, data?: LessonPrisma) {
        this.id = id
        if (data) this.load(data)
    }

    async init() {
        const data = await prisma.lesson.findUnique({ where: { id: this.id }, include: lesson_include })
        if (!data) throw "lição não encontrada"

        this.load(data)
    }

    load(data: LessonPrisma) {
        this.id = data.id
        this.thumb = data.thumb
        this.name = data.name
        this.pdf = data.pdf
        this.published = data.published
        this.media = new Media(data.media)
        this.course_id = data.course_id
        this.course = data.course
        this.info = data.info

        this.views = data._count.views
        this.likes = data._count.likes
        this.downloads = data._count.downloads
        this.favorited_by = data.likes.map((item) => ({ id: item.id }))
        this.status = data.status
        this.declined_reason = data.declined_reason
    }

    async updateMedia(media: MediaForm) {
        this.media = await Media.update(this.media.id, media, `course/lessons/${this.course_id}`)
    }

    async updateThumb(thumb: FileUpload) {
        const thumb_url = saveFile(`course/lessons/${this.course_id}`, thumb)
        await prisma.lesson.update({ where: { id: this.id }, data: { thumb: thumb_url } })
    }

    async update(data: Partial<LessonForm>) {
        if (data.media) {
            await this.updateMedia(data.media)
        }

        if (data.thumb) {
            await this.updateThumb(data.thumb)
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

    async addLike(user_id: string, like?: boolean) {
        const data = await prisma.lesson.update({
            where: { id: this.id },
            data: {
                likes: like ? { connect: { id: user_id } } : { disconnect: { id: user_id } },
            },
            include: lesson_include,
        })

        this.load(data)
    }

    async addView(user_id: string) {
        const data = await prisma.lesson.update({
            where: { id: this.id },
            data: { views: { create: { datetime: new Date().getTime().toString(), user_id } } },
            include: lesson_include,
        })

        this.load(data)
    }

    async getViews() {
        const views = await prisma.lesson.findUnique({ where: { id: this.id }, select: { views: true } })
        return views?.views
    }
}
