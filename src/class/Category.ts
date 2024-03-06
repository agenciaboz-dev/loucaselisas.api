import { Prisma } from "@prisma/client"
import { category as include } from "../prisma/include"
import { Creator, CreatorPrisma } from "./Creator"

export type CategoryPrisma = Prisma.CategoryGetPayload<{ include: typeof include }>

export class Category {
    id: string
    name: string
    cover: string

    creators: Creator[] = []

    constructor(data: CategoryPrisma) {}

    load(data: CategoryPrisma, creators: CreatorPrisma[]) {
        this.id = data.id
        this.name = data.name
        this.cover = data.cover

        this.creators = creators.map((creator) => new Creator(creator.id))
    }
}
