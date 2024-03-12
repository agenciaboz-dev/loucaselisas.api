import { Prisma } from "@prisma/client"
import { Course } from "./Course"
import { User, UserPrisma } from "./index"
import { WithoutFunctions } from "./helpers"

export const student_include = Prisma.validator<Prisma.StudentInclude>()({ courses: true, user: true })
export type StudentPrisma = Prisma.StudentGetPayload<{ include: typeof student_include }>
// export type StudentForm = Omit<WithoutFunctions<Student>, "id" | "courses" | "user_id">

export class Student {
    courses: Course[]
    id: string
    user_id: string

    constructor(id: string, data?: StudentPrisma) {
        this.id = id
        data ? this.load(data) : (this.id = id)
    }

    load(data: StudentPrisma) {
        this.courses = data.courses
        this.user_id = data.user_id
    }
}
