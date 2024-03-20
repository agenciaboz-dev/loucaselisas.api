import { Prisma } from "@prisma/client"

export const category_include = Prisma.validator<Prisma.CategoryInclude>()({})
export type CategoryPrisma = Prisma.CategoryGetPayload<{ include: typeof category_include }>

export class Category {
    id: string
    name: string
    cover: string

    constructor(data: CategoryPrisma) {}

    load(data: CategoryPrisma) {
        this.id = data.id
        this.name = data.name
        this.cover = data.cover
    }
}
