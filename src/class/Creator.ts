import { Prisma } from "@prisma/client"
import { FileUpload, WithoutFunctions } from "./helpers"
import { Course, course_include } from "./Course"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { uid } from "uid"
import { handlePrismaError } from "../prisma/errors"
import { saveFile } from "../tools/saveFile"

export const creator_include = Prisma.validator<Prisma.CreatorInclude>()({
    categories: true,
    courses: { include: course_include },
    favorited_by: true,
    owned_courses: { include: course_include },
})
export type CreatorPrisma = Prisma.CreatorGetPayload<{ include: typeof creator_include }>
export type CreatorType = WithoutFunctions<Creator>
export type CreatorForm = Omit<WithoutFunctions<Creator>, "active" | "courses" | "id">
export type PartialCreator = Partial<Creator> & { id: string }
export interface CreatorImageForm {
    id: string
    image?: FileUpload | null
    cover?: FileUpload | null
}

export class Creator {
    id: string
    user_id: string
    nickname: string
    language: string
    description: string
    active: boolean
    favorited_by: number
    owned_courses: Course[] = []
    cover: string | null
    image: string | null

    courses: Course[] = []

    constructor(id: string, data?: CreatorPrisma) {
        this.id = id
        data ? this.load(data) : (this.id = id)
    }

    async init() {
        const creator_prisma = await prisma.creator.findUnique({ where: { id: this.id }, include: creator_include })
        if (creator_prisma) {
            this.load(creator_prisma)
        } else {
            throw "criador não encontrado"
        }
    }

    static async list(socket?: Socket) {
        const creators_prisma = await prisma.creator.findMany({ include: creator_include })

        const creators = await Promise.all(creators_prisma.map(async (item) => new Creator(item.id, item)))

        socket?.emit("creator:list", creators)
        return creators
    }

    static async new(data: CreatorForm, socket?: Socket) {
        try {
            const creator_prisma = await prisma.creator.create({
                data: {
                    ...data,
                    favorited_by: {},
                    id: uid(),
                    owned_courses: {},
                    active: true,
                },
                include: creator_include,
            })
            const creator = new Creator(creator_prisma.id)
            await creator.init()

            socket?.emit("creator:signup", creator)
            socket?.broadcast.emit("creator:update", creator)

            return creator
        } catch (error) {
            console.log(error)
            const message = handlePrismaError(error)
            socket?.emit("creator:signup:error", message)
        }
    }

    static async delete(id: string, socket?: Socket) {
        try {
            const deleted = await prisma.creator.delete({ where: { id } })
            socket?.emit("creator:delete", deleted)
            socket?.broadcast.emit("creator:delete", deleted)
            return deleted
        } catch (error) {
            console.log(error)
            const message = handlePrismaError(error)
            socket?.emit("creator:delete:error", message)
        }
    }

    load(data: CreatorPrisma) {
        console.log(data)
        this.active = data.active
        this.language = data.language
        this.nickname = data.nickname
        this.user_id = data.user_id
        if (data.courses) {
            this.courses = data.courses.map((course) => new Course(course))
        }
        if (data.owned_courses) {
            this.owned_courses = data.owned_courses.map((course) => new Course(course))
        }
        this.description = data.description
        this.favorited_by = data.favorited_by?.length || 0
        this.image = data.image
        this.cover = data.cover
    }

    async update(data: Partial<Creator>) {
        try {
            const updated_creator = await prisma.creator.update({
                where: { id: this.id },
                data: {
                    ...data,
                    id: undefined,
                    favorited_by: {},
                    owned_courses: {},
                    courses: {},
                },
                include: creator_include,
            })
            this.load(updated_creator)
            return this
        } catch (error) {
            console.log(error)
        }
    }

    async updateImage(data: CreatorImageForm, socket?: Socket) {
        try {
            if (data.image) {
                const url = saveFile(`/users/${this.user_id}/creator`, data.image)
                await this.update({ image: url })
            }

            if (data.cover) {
                const url = saveFile(`/users/${this.user_id}/creator`, data.cover)
                await this.update({ cover: url })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
