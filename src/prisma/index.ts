import { PrismaClient } from "@prisma/client"
import include from './include'

export const prisma = new PrismaClient()

export default { prisma, include }
