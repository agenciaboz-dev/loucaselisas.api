import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { FileUpload, WithoutFunctions } from "./helpers"
import { saveFile } from "../tools/saveFile"
import { uid } from "uid"
import { Course, course_include } from "./Course"

export const category_include = Prisma.validator<Prisma.CategoryInclude>()({})
export type CategoryPrisma = Prisma.CategoryGetPayload<{ include: typeof category_include }>
export type CategoryForm = Omit<WithoutFunctions<Category>, "id" | "cover"> & { cover?: FileUpload }
export type PartialCategory = Partial<CategoryForm> & { id: string }

export class Category {
    id: string
    name: string
    cover: string
    active: boolean

    static async list(all?: boolean) {
        const categories_prisma = await prisma.category.findMany({ where: { active: all ? undefined : true }, include: category_include })
        const categories = categories_prisma.map((item) => new Category("", item))
        return categories
    }

    static async new(data: CategoryForm) {
        const category_prisma = await prisma.category.create({ data: { ...data, id: uid(), cover: "" } })
        const category = new Category("", category_prisma)

        if (data.cover) {
            await category.updateCover(data.cover)
        }

        return category
    }

    constructor(id: string, data?: CategoryPrisma) {
        this.id = id
        if (data) this.load(data)
    }

    async init() {
        const data = await prisma.category.findUnique({ where: { id: this.id }, include: category_include })
        if (data) this.load(data)
    }

    load(data: CategoryPrisma) {
        this.id = data.id
        this.name = data.name
        this.cover = data.cover
        this.active = data.active
    }

    async updateCover(cover: FileUpload) {
        const url = saveFile(`categories/${this.id}`, cover)
        const data = await prisma.category.update({ where: { id: this.id }, data: { cover: url } })
        this.load(data)
    }

    async getCourses() {
        const data = await prisma.course.findMany({ where: { categories: { some: { id: this.id } } }, include: course_include })
        const courses = data.map((item) => new Course("", item))
        return courses
    }

    async update(data: PartialCategory) {
        if (data.cover) {
            await this.updateCover(data.cover)
        }

        const updated = await prisma.category.update({ where: { id: this.id }, data: { ...data, cover: undefined }, include: category_include })
        this.load(updated)
    }
}
