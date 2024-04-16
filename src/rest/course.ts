import express, { Express, Request, Response } from "express"
import { Course, CourseForm, PartialCourse, course_include } from "../class/Course"
import { User } from "../class"
import { prisma } from "../prisma"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const course_id = request.query.course_id as string | undefined
    if (course_id) {
        try {
            const course = new Course(course_id)
            await course.init()
            response.json(course)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("missing course id")
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as CourseForm

    try {
        const course = await Course.new(data)
        console.log(course)
        response.status(200).send()
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PartialCourse
    console.log(data.price)
    try {
        const course = new Course(data.id)
        await course.init()
        await course.update(data)
        response.status(200).send()
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { course_id: string }
    console.log(data)
    try {
        const deleted = await prisma.course.delete({ where: { id: data.course_id } })
        response.json(deleted)
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
            const courses = courses_prisma.map((item) => new Course("", item))
            console.log(courses)
            response.json(courses)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    }
})

router.get("/all", async (request: Request, response: Response) => {
    try {
        const prisma_courses = await prisma.course.findMany({ include: course_include })
        const courses = prisma_courses.map((item) => new Course("", item))
        response.json(courses)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
