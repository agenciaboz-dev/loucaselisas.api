import { Prisma } from "@prisma/client"

export const user = Prisma.validator<Prisma.UserInclude>()({})

export default {user}