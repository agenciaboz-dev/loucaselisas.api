import { Prisma } from "@prisma/client";
import {user as user_include} from '../prisma/include'

export type UserPrisma = Prisma.UserGetPayload<{include: typeof user_include}>

export class User {

}