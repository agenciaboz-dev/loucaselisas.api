import { Prisma } from "@prisma/client"
import { WithoutFunctions } from "./helpers"
import { Course } from "./Course"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { uid } from "uid"
import { handlePrismaError } from "../prisma/errors"

export const creator_include = Prisma.validator<Prisma.CreatorInclude>()({
    categories: true,
    courses: true,
    favorited_by: true,
})
export type CreatorPrisma = Prisma.CreatorGetPayload<{ include: typeof creator_include }>
export type CreatorType = WithoutFunctions<Creator>
export type CreatorForm = Omit<WithoutFunctions<Creator>, "active" | "courses" | "id">

export class Creator {
    id: string
    user_id: string
    nickname: string
    language: string
    description: string
    active: boolean

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

    static async list(socket: Socket) {
        const creators_prisma = await prisma.creator.findMany({ include: creator_include })

        const creators = await Promise.all(creators_prisma.map(async (item) => new Creator(item.id, item)))

        socket.emit("creator:list", creators)
    }

    static async new(socket: Socket, data: CreatorForm) {
        try {
            const creator_prisma = await prisma.creator.create({
                data: {
                    ...data,
                    id: uid(),
                },
                include: creator_include,
            })
            const creator = new Creator(creator_prisma.id)
            await creator.init()

            socket.emit("creator:signup", creator)
            socket.broadcast.emit("creator:update", creator)
        } catch (error) {
            handlePrismaError(error, { socket, event: "creator:signup:error" }) || console.log(error)
        }
    }

    static async delete(socket: Socket, id: string) {
        try {
            const deleted = await prisma.creator.delete({ where: { id } })
            socket.emit("creator:delete", deleted)
            socket.broadcast.emit("creator:delete", deleted)
        } catch (error) {
            handlePrismaError(error, { socket, event: "creator:delete:error" })
        }
    }

    load(data: CreatorPrisma) {
        this.active = data.active
        this.language = data.language
        this.nickname = data.nickname
        this.courses = data.courses
        this.description = data.description
    }
}
