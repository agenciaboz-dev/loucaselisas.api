import { Prisma } from "@prisma/client"
import { Media, MediaForm } from "../Gallery/Media"
import { FileUpload, WithoutFunctions } from "../helpers"
import { prisma } from "../../prisma"
import { uid } from "uid"
import { saveFile } from "../../tools/saveFile"
import { Status } from "../Course"
import { User } from "../User"
import { Notification } from "../Notification"
import templates from "../../templates"

export const lesson_include = Prisma.validator<Prisma.LessonInclude>()({
    media: true,
    likes: true,
    course: { include: { favorited_by: true } },
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
    status?: Status
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
        lesson.sendCreatedNotification()
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

        if (data.status == "declined" && this.status != "declined") {
            this.sendDeclinedNotification()
        }

        if (data.status == "active" && this.status != "active") {
            this.sendActiveNotification()
        }

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

        if (like) {
            const course_owner = await this.getOwner()
            await course_owner.init()
            const user = new User(user_id)
            await user.init()
            const template = templates.notifications.onLessonLike(user.username, this.course.name, this.name)
            await Notification.new([
                {
                    title: template.title,
                    body: template.body,
                    expoPushToken: course_owner.expoPushToken,
                    target_param: { lesson_id: this.id },
                    target_route: "creator,creator:lesson",
                    user_id: course_owner.id,
                    image: this.thumb || this.media.url,
                },
            ])
        }
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

    async getOwner() {
        const creator = await prisma.creator.findUnique({ where: { id: this.course.owner_id } })
        if (!creator) throw "criador não encontrado"
        const user = await User.findById(creator.user_id)
        return user
    }

    async sendCreatedNotification() {
        const admins = await User.getAdmins()
        const owner = await this.getOwner()
        const template_creator = templates.notifications.onLessonCreate(this.course.name, this.name)
        const template_adm = templates.notifications.onLessonCreateAdm(this.course.name, this.name)

        const notifications = await Notification.new([
            {
                title: template_creator.title,
                body: template_creator.body,
                expoPushToken: owner.expoPushToken,
                target_param: { lesson_id: this.id },
                target_route: "creator,creator:lesson",
                user_id: owner.id,
                image: this.thumb || this.media.url,
            },
            ...admins.map((admin) => ({
                title: template_adm.title,
                body: template_adm.body,
                expoPushToken: admin.expoPushToken,
                target_param: { lesson_id: this.id },
                target_route: "lesson",
                user_id: admin.id,
                image: this.course.cover,
            })),
        ])
    }

    async sendActiveNotification() {
        const owner = await this.getOwner()
        const users_who_liked = await Promise.all(this.course.favorited_by.map(async (item: { id: string }) => await User.findById(item.id)))
        const template_creator = templates.notifications.onLessonApprove(this.course.name, this.name)
        const template_followers = templates.notifications.onLessonApproveToFollowers(this.course.name)

        const notifications = await Notification.new([
            {
                title: template_creator.title,
                body: template_creator.body,
                expoPushToken: owner.expoPushToken,
                target_param: { lesson_id: this.id },
                target_route: "creator,creator:lesson",
                user_id: owner.id,
                image: this.thumb || this.media.url,
            },
            ...users_who_liked.map((user) => ({
                title: template_followers.title,
                body: template_followers.body,
                expoPushToken: user.expoPushToken,
                target_param: { lesson_id: this.id },
                target_route: "lesson",
                user_id: user.id,
                image: this.course.cover,
            })),
        ])
    }

    async sendDeclinedNotification() {
        const owner = await this.getOwner()
        const template = templates.notifications.onLessonDecline(this.course.name, this.name)
        const notifications = await Notification.new([
            {
                title: template.title,
                body: template.body,
                expoPushToken: owner.expoPushToken,
                target_param: { lesson_id: this.id },
                target_route: "creator,creator:lesson",
                user_id: owner.id,
                image: this.thumb || this.media.url,
            },
        ])
    }
}
