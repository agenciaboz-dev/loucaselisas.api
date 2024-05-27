import { Creator } from "./Creator"
import { Category } from "./Category"
import { Prisma } from "@prisma/client"
import { Gallery, GalleryForm, gallery_include } from "./Gallery/Gallery"
import { Chat, chat_include } from "./Chat/Chat"
import { Lesson, LessonForm, lesson_include } from "./Course/Lesson"
import { FileUpload, WithoutFunctions } from "./helpers"
import { Socket } from "socket.io"
import { prisma } from "../prisma"
import { uid } from "uid"
import { saveFile } from "../tools/saveFile"
import { Role, role_include } from "./Role"
import { Message, message_include } from "./Chat/Message"
import { User } from "./User"
import { Plan } from "./Plan"

export type Status = "active" | "pending" | "disabled" | "declined"
export interface StatusForm {
    id: string
    status: Status
    declined_reason?: string
    price?: number
    plans?: Plan[]
}

export const course_include = Prisma.validator<Prisma.CourseInclude>()({
    categories: true,
    chat: { include: chat_include },
    creators: { include: { user: true } },
    gallery: { include: gallery_include },
    owner: { include: { user: true } },
    favorited_by: { select: { id: true } },
    roles: { include: role_include },
    lessons: { include: { _count: { select: { downloads: true } } } },
    plans: true,

    _count: { select: { lessons: true, favorited_by: true, students: true, views: true } },
})

export type CoursePrisma = Prisma.CourseGetPayload<{ include: typeof course_include }>
export type CoverForm = { file: FileUpload; type: "image" | "video"; url?: string }

export type PartialCourse = Partial<
    Omit<
        WithoutFunctions<Course>,
        "favorited_by" | "cover" | "cover_type" | "owner" | "gallery" | "creators" | "chat" | "published" | "lessons" | "students" | "views" | "plans"
    >
> & { id: string; cover?: CoverForm; gallery?: GalleryForm; creators?: { id: string }[]; plans: number[] }

export type CourseForm = Omit<
    WithoutFunctions<Course>,
    | "id"
    | "favorited_by"
    | "lessons"
    | "cover"
    | "cover_type"
    | "owner"
    | "gallery"
    | "categories"
    | "creators"
    | "chat"
    | "published"
    | "students"
    | "views"
    | "roles"
    | "likes"
    | "downloads"
    | "status"
    | "declined_reason"
    | "plans"
    | "price"
> & {
    lessons: LessonForm[]
    cover?: CoverForm
    gallery: GalleryForm
    categories: { id: string }[]
    creators: { id: string }[]
    owner_id: string
    id?: string
    declined_reason?: string
}

export class Course {
    id: string
    name: string
    cover: string
    cover_type: "image" | "video"
    published: string
    description: string
    language: string
    recorder: string | null
    price: number

    owner: Partial<Creator> & { user: Partial<User> }
    owner_id: string
    gallery: Gallery
    categories: Category[]
    creators: Partial<Creator>[]
    chat: Chat | null
    roles: Role[]
    plans: Plan[]
    favorited_by: { id: string }[]

    status: Status
    declined_reason: string | null

    // ? {_count: }
    likes: number
    lessons: number
    students: number
    views: number
    downloads: number

    constructor(id: string, data?: CoursePrisma) {
        this.id = id
        if (data) this.load(data)
    }

    static async getFromChat(id: string) {
        const chat = await prisma.chat.findFirst({ where: { id } })
        if (!chat) throw "chat não encontrado"

        const data = await prisma.course.findFirst({ where: { id: chat.course_id }, include: course_include })
        if (!data) throw "curso não encontrado"
        const course = new Course("", data)
        return course
    }

    static async list(all?: boolean) {
        const prisma_courses = await prisma.course.findMany({ where: { status: all ? undefined : "active" }, include: course_include })
        const courses = prisma_courses.map((item) => new Course("", item))
        return courses
    }

    static async search(role_id: number, text: string) {
        console.log(text)
        const data = await prisma.course.findMany({
            where: { name: { contains: text.trim() }, status: "active", roles: { some: { id: { equals: role_id } } } },
            include: course_include,
        })
        const courses = data.map((item) => new Course("", item))
        return courses
    }

    static async new(data: CourseForm, socket?: Socket) {
        console.log("new course")
        try {
            const gallery = await Gallery.new(data.gallery)
            const new_course = await prisma.course.create({
                data: {
                    ...data,

                    id: uid(),
                    price: 0,
                    cover: "",
                    lessons: {},
                    published: new Date().getTime().toString(),
                    categories: { connect: data.categories },
                    creators: { connect: data.creators },
                    gallery: undefined,
                    gallery_id: gallery.id,
                    favorited_by: {},
                    chat: {
                        create: {
                            id: uid(),
                            media: {
                                create: {
                                    id: uid(),
                                    name: `Grupo de ${data.name}`,
                                },
                            },
                        },
                    },
                    students: {},
                    roles: { connect: { id: 1 } },
                    plans: { connect: { id: 1 } },
                },
                include: course_include,
            })

            const course = new Course("", new_course)
            console.log(course)

            if (data.cover) {
                await course.updateCover(data.cover)
            }

            socket?.emit("course:new", course)
            socket?.broadcast.emit("course:update", course)

            return course
        } catch (error) {
            console.log(error)
            socket?.emit("course:new:error", error?.toString())
        }
    }

    async init() {
        const data = await prisma.course.findUnique({ where: { id: this.id }, include: course_include })
        if (data) {
            this.load(data)
        } else {
            throw "course not found"
        }
    }

    load(data: CoursePrisma) {
        this.id = data.id
        this.cover = data.cover
        this.cover_type = data.cover_type
        this.description = data.description
        this.gallery = new Gallery("", data.gallery)
        this.language = data.language
        this.name = data.name
        this.published = data.published
        this.recorder = data.recorder

        this.categories = data.categories.map((category) => new Category("", category))

        this.owner = data.owner
        this.owner_id = data.owner_id
        this.creators = data.creators
        this.price = data.price
        this.roles = data.roles.map((item) => new Role(item))
        this.plans = data.plans.map((item) => new Plan(0, item))
        this.favorited_by = data.favorited_by

        if (data.chat) {
            this.chat = new Chat(data.chat)
        }

        this.likes = data._count.favorited_by
        this.students = data._count.students
        // this.lessons = data._count.lessons
        this.lessons = data.lessons.reduce((count, lesson) => (lesson.status == "active" ? (count += 1) : count), 0)
        this.views = data._count.views
        this.downloads = data.lessons.reduce((downloads, lesson) => (lesson._count.downloads += downloads), 0)
        this.status = data.status
        this.declined_reason = data.declined_reason
    }

    async updateCover(cover: CoverForm) {
        const url = saveFile(`courses/${this.id}`, cover.file)
        const data = await prisma.course.update({ where: { id: this.id }, data: { cover: url, cover_type: cover.type }, include: course_include })
        this.load(data)
    }

    async update(data: PartialCourse) {
        if (data.gallery?.id) {
            const gallery = new Gallery(data.gallery.id)
            await gallery.init()
            await gallery.updateMedia(data.gallery.media)
        }

        if (data.cover?.file.file || data.cover?.file.base64) {
            console.log(data.cover)
            await this.updateCover(data.cover)
        }

        const prisma_data = await prisma.course.update({
            where: { id: this.id },
            data: {
                ...data,
                id: undefined,
                categories: { connect: data.categories },
                creators: { connect: data.creators },
                gallery: undefined,
                gallery_id: undefined,
                chat: undefined,
                cover: undefined,
                lessons: undefined,
                plans: data.plans ? { set: [], connect: data.plans.map((id) => ({ id })) } : undefined,
                // TODO
                roles: data.roles ? {} : undefined,
            },
            include: course_include,
        })

        this.load(prisma_data)
    }

    async viewer(user_id: string) {
        const data = await prisma.course.update({
            where: { id: this.id },
            data: { views: { create: { user_id, datetime: new Date().getTime().toString() } } },
            include: course_include,
        })

        this.load(data)
    }

    async addLike(user_id: string, like?: boolean) {
        const data = await prisma.course.update({
            where: { id: this.id },
            data: {
                favorited_by: like ? { connect: { id: user_id } } : { disconnect: { id: user_id } },
            },
            include: course_include,
        })

        this.load(data)
    }

    async getLessons() {
        const data = await prisma.lesson.findMany({ where: { course_id: this.id }, include: lesson_include })
        const lessons = data.map((item) => new Lesson("", item))
        return lessons
    }

    async getLastMessage() {
        const data = await prisma.message.findFirst({
            where: { chat_id: this.chat?.id },
            orderBy: { datetime: "desc" },
            take: 1,
            include: message_include,
        })
        if (data) {
            const message = new Message(data)
            return message
        }
    }

    async getViews() {
        const views = await prisma.course.findUnique({ where: { id: this.id }, select: { views: true } })
        return views?.views
    }

    // async getLikes() {
    //     const likes = await prisma.
    // }
}
