import express, { Express, Request, Response } from "express"
import { Course, CourseForm, course_include } from "../class/Course"
import { User } from "../class"
import { prisma } from "../prisma"
const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as CourseForm

    try {
        const course = await Course.new(data)
        console.log(course)
        if (course?.owner.user_id) {
            const user = new User(course.owner.user_id)
            await user.init()
            response.json(user)
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/owner", async (request: Request, response: Response) => {
    const owner_id = request.query.owner_id as string | undefined
    console.log(`getting courses for owner ${owner_id}`)

    if (owner_id) {
        try {
            const courses_prisma = await prisma.course.findMany({ where: { owner_id: owner_id }, include: course_include })
            const courses = courses_prisma.map((item) => new Course(item))
            console.log(courses)
            response.json(courses)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    }
})

export default router
