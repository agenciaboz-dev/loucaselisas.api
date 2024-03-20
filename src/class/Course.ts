import { Creator } from "./Creator"
import { Category } from "./Category"
import { Prisma } from "@prisma/client"
import { Gallery, gallery_include } from "./Gallery"
import { Chat, chat_include } from "./Chat/Chat"
import { Lesson, lesson_include } from "./Course/Lesson"

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
}
