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
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const course_include = Prisma.validator<Prisma.CourseInclude>()({
    categories: true,
    chat: { include: chat_include },
    creators: { include: { user: true } },
    gallery: { include: gallery_include },
    owner: { include: { user: true } },
    students: true,
    favorited_by: true,
    lessons: { include: lesson_include },
})

export type CoursePrisma = Prisma.CourseGetPayload<{ include: typeof course_include }>
export type CoverForm = { file: FileUpload; type: "image" | "video"; url?: string }
export type PartialCourse = Partial<
    Omit<WithoutFunctions<Course>, "favorited_by" | "cover" | "cover_type" | "owner" | "gallery" | "creators" | "chat" | "published">
> & { id: string; cover?: CoverForm; gallery: GalleryForm; creators: { id: string }[] }
export type CourseForm = Omit<
    WithoutFunctions<Course>,
    "id" | "favorited_by" | "lessons" | "cover" | "cover_type" | "owner" | "gallery" | "categories" | "creators" | "chat" | "published"
> & {
    lessons: LessonForm[]
    cover?: CoverForm
    gallery: GalleryForm
    categories: { id: string }[]
    creators: { id: string }[]
    owner_id: string
    id?: string
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
    favorited_by: number
    price: number

    lessons: Lesson[]
    owner: Partial<Creator>
    owner_id: string
    gallery: Gallery
    categories: Category[]
    creators: Partial<Creator>[]
    chat: Chat | null

    constructor(id: string, data?: CoursePrisma) {
        this.id = id
        if (data) this.load(data)
    }

    static async new(data: CourseForm, socket?: Socket) {
        console.log("new course")
        try {
            const gallery = await Gallery.new(data.gallery)
            console.log(gallery)
            const new_course = await prisma.course.create({
                data: {
                    ...data,

                    id: uid(),
                    cover: "",
                    lessons: {},
                    published: new Date().getTime().toString(),
                    categories: { connect: data.categories },
                    creators: { connect: data.creators },
                    gallery: undefined,
                    gallery_id: gallery.id,
                    favorited_by: {},
                    chat: {},
                    students: {},
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
        this.gallery = new Gallery(data.gallery)
        this.language = data.language
        this.name = data.name
        this.published = data.published
        this.recorder = data.recorder

        this.favorited_by = data.favorited_by.length

        this.categories = data.categories.map((category) => new Category(category))
        this.lessons = data.lessons.map((lesson) => new Lesson(lesson))

        this.owner = data.owner
        this.owner_id = data.owner_id
        this.creators = data.creators
        this.price = data.price

        if (data.chat) {
            this.chat = new Chat(data.chat)
        }
    }

    async updateCover(cover: CoverForm) {
        const url = saveFile(`courses/${this.id}`, cover.file)
        const data = await prisma.course.update({ where: { id: this.id }, data: { cover: url, cover_type: cover.type }, include: course_include })
        this.load(data)
    }

    async update(data: PartialCourse) {
        if (data.gallery) {
            // const gallery = new Gallery({...data.gallery, media: []})
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
            },
            include: course_include,
        })

        this.load(prisma_data)
    }
}
