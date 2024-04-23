import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { FileUpload, WithoutFunctions } from "./helpers"
import { saveFile } from "../tools/saveFile"
import { uid } from "uid"

export const category_include = Prisma.validator<Prisma.CategoryInclude>()({})
export type CategoryPrisma = Prisma.CategoryGetPayload<{ include: typeof category_include }>
export type CategoryForm = Omit<WithoutFunctions<Category>, "id" | "cover"> & { cover?: FileUpload }

export class Category {
    id: string
    name: string
    cover: string

    static async list() {
        const categories_prisma = await prisma.category.findMany({ include: category_include })
        const categories = categories_prisma.map((item) => new Category(item))
        return categories
    }

    static async new(data: CategoryForm) {
        const category_prisma = await prisma.category.create({ data: { ...data, id: uid(), cover: "" } })
        const category = new Category(category_prisma)

        if (data.cover) {
            await category.updateCover(data.cover)
        }

        return category
    }

    constructor(data: CategoryPrisma) {
        this.load(data)
    }

    load(data: CategoryPrisma) {
        this.id = data.id
        this.name = data.name
        this.cover = data.cover
    }

    async updateCover(cover: FileUpload) {
        const url = saveFile(`categories/${this.id}`, cover)
        const data = await prisma.category.update({ where: { id: this.id }, data: { cover: url } })
        this.load(data)
    }
}
