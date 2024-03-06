import { Prisma } from "@prisma/client"
import { PickDiff, WithoutFunctions } from "./helpers"
import { Course } from "./Course"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { uid } from "uid"
import { handlePrismaError } from "../prisma/errors"
import { User, UserPrisma, user_include } from "./index"

export const creator_include = Prisma.validator<Prisma.CreatorInclude>()({
    user: true,
    categories: true,
    courses: true,
    favorited_by: true,
})
export type CreatorPrisma = Prisma.CreatorGetPayload<{ include: typeof creator_include }>

export type CreatorForm = Omit<WithoutFunctions<PickDiff<Creator, User>>, "active" | "courses" | "creator_id"> & { user_id: string }

export class Creator extends User {
    nickname: string
    language: string
    description: string
    active: boolean
    creator_id: string

    courses: Course[] = []

    constructor(id: string, data?: UserPrisma & CreatorPrisma) {
        super(id)
        this.creator_id = id
        data ? this.load(data) : (this.id = id)
    }

    async init() {
        const creator_prisma = await prisma.creator.findUnique({ where: { id: this.id }, include: creator_include })
        if (creator_prisma) {
            const user_prisma = await prisma.user.findUnique({ where: { id: creator_prisma.user_id }, include: user_include })
            user_prisma && this.load({ ...creator_prisma, ...user_prisma })
        } else {
            throw "criador não encontrado"
        }
    }

    static async list(socket: Socket) {
        const creators_prisma = await prisma.creator.findMany({ include: creator_include })

        const creators = await Promise.all(
            creators_prisma.map(async (item) => {
                const user_prisma = await prisma.user.findUnique({ where: { id: item.user_id }, include: user_include })
                if (user_prisma) {
                    const creator = new Creator(item.id, { ...item, ...user_prisma })
                    return creator
                } else {
                    throw "usuário não encontrado"
                }
            })
        )

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

    load(data: UserPrisma & CreatorPrisma) {
        super.load(data)
        this.active = data.active
        this.language = data.language
        this.nickname = data.nickname
        this.courses = data.courses
        this.description = data.description
    }
}
