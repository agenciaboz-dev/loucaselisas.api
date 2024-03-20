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

export type CourseForm = Omit<
    WithoutFunctions<Course>,
    "id" | "favorited_by" | "lessons" | "cover" | "owner" | "gallery" | "categories" | "creators" | "chat"
> & {
    lessons: LessonForm[]
    cover?: FileUpload
    gallery: GalleryForm
    categories: { id: string }[]
    creators: { id: string }[]
    owner_id: string
}

export class Course {
    id: string
    name: string
    cover: string
    published: string
    description: string
    language: string
    recorder: string | null
    favorited_by: number

    lessons: Lesson[]
    owner: Partial<Creator>
    gallery: Gallery
    categories: Category[]
    creators: Partial<Creator>[]
    chat: Chat | null

    constructor(data: CoursePrisma) {
        this.id = data.id
        this.cover = data.cover
        this.description = data.description
        this.gallery = data.gallery
        this.language = data.language
        this.name = data.name
        this.published = data.published
        this.recorder = data.recorder

        this.favorited_by = data.favorited_by.length

        this.categories = data.categories.map((category) => new Category(category))
        this.lessons = data.lessons.map((lesson) => new Lesson(lesson))

        this.owner = data.owner
        this.creators = data.creators

        if (data.chat) {
            this.chat = new Chat(data.chat)
        }
    }

    static async new(socket: Socket, data: CourseForm) {
        try {
            const gallery = await Gallery.new(data.gallery)
            const new_course = await prisma.course.create({
                data: {
                    ...data,
                    id: uid(),
                    cover: "",
                    lessons: {
                        create: data.lessons.map((lesson) => {
                            return {
                                ...lesson,
                                id: uid(),
                                cover: undefined,
                                image: undefined,
                                video: undefined,
                                published: new Date().getTime().toString(),
                            }
                        }),
                    },
                    published: new Date().getTime().toString(),
                    categories: { connect: data.categories },
                    creators: { connect: data.creators },
                    gallery: undefined,
                    gallery_id: gallery.id,
                },
            })

            const images_url = data.gallery.images.map((image) => saveFile(`courses/${new_course.id}/gallery/`, image))
            const videos_url = data.gallery.videos.map((video) => saveFile(`courses/${new_course.id}/gallery/`, video))

            const course_prisma = await prisma.course.update({
                where: { id: new_course.id },
                data: {
                    gallery: {
                        update: {
                            images: { create: images_url.map((url) => ({ id: uid(), url })) },
                            videos: { create: videos_url.map((url) => ({ id: uid(), url })) },
                        },
                    },
                    lessons: {
                        create: data.lessons.map((lesson) => {
                            let image_url = lesson.image ? saveFile(`courses/${new_course.id}/lessons/`, lesson.image) : undefined
                            let video_url = lesson.video ? saveFile(`courses/${new_course.id}/lessons/`, lesson.video) : undefined
                            let cover_url = lesson.cover ? saveFile(`courses/${new_course.id}/lessons/`, lesson.cover) : undefined

                            return {
                                ...lesson,
                                id: uid(),
                                image: image_url ? { create: { id: uid(), url: image_url } } : {},
                                video: video_url ? { create: { id: uid(), url: video_url } } : {},
                                cover: cover_url,
                                published: new Date().getTime().toString(),
                            }
                        }),
                    },
                },
                include: course_include,
            })

            const course = new Course(course_prisma)
            socket.emit("course:new", course)
            socket.broadcast.emit("course:update", course)
        } catch (error) {
            console.log(error)
            socket.emit("course:new:error", error?.toString())
        }
    }
}
