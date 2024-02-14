import { Prisma } from "@prisma/client"

export const user = Prisma.validator<Prisma.UserInclude>()({
    courses: true,
    creator: { include: { user: true, courses: true, categories: true, favorited_by: true } },
    favorite_courses: true,
    favorite_creators: { include: { user: true, courses: true, categories: true, favorited_by: true } },
})

export const creator = Prisma.validator<Prisma.CreatorInclude>()({
    user: { include: user },
    categories: true,
    courses: true,
    favorited_by: { include: user },
})

export const category = Prisma.validator<Prisma.CategoryInclude>()({ creators: true })

export default {user}