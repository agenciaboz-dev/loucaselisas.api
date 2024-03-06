import { Prisma } from "@prisma/client"


export const category = Prisma.validator<Prisma.CategoryInclude>()({ creators: true })
