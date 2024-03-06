import { Prisma } from "@prisma/client"
import { Course } from "./Course"
import { User, UserPrisma } from "./index"

export const student_include = Prisma.validator<Prisma.StudentInclude>()({ courses: true, user: true })
export type StudentPrisma = Prisma.StudentGetPayload<{ include: typeof student_include }>

export class Student extends User {
    courses: Course[]
    student_id: string

    constructor(id: string, data?: UserPrisma & StudentPrisma) {
        super(id)
        this.student_id = id
        data ? this.load(data) : (this.id = id)
    }
}
