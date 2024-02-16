import { Prisma } from "@prisma/client"
import { Course } from "./Course"
import { creator as include } from "../prisma/include"
import { prisma } from "../prisma"

export type CreatorPrisma = Prisma.CreatorGetPayload<{ include: typeof include }>

export class Creator {
    id: string
    nickname: string
    language: string
    description: string
    active: boolean

    courses: Course[] = []

    constructor(id: string) {
        this.id = id
    }

    async init() {
        const creator_prisma = await prisma.creator.findUnique({ where: { id: this.id }, include })
        if (creator_prisma) {
            this.load(creator_prisma)
        } else {
            throw "criador não encontrado"
        }
    }

    load(data: CreatorPrisma) {
        this.id = data.id
        this.active = data.active
        this.language = data.language
        this.nickname = data.nickname
        this.courses = data.courses
    }
}
