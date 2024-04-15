import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"

export const category_include = Prisma.validator<Prisma.CategoryInclude>()({})
export type CategoryPrisma = Prisma.CategoryGetPayload<{ include: typeof category_include }>

export class Category {
    id: string
    name: string
    cover: string

    static async list() {
        const categories_prisma = await prisma.category.findMany({ include: category_include })
        const categories = categories_prisma.map((item) => new Category(item))
        return categories
    }

    constructor(data: CategoryPrisma) {
        this.load(data)
    }

    load(data: CategoryPrisma) {
        this.id = data.id
        this.name = data.name
        this.cover = data.cover
    }
}
