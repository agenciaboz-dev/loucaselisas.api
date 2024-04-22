import express, { Express, Request, Response } from "express"
import { Course, CourseForm, PartialCourse, course_include } from "../class/Course"
import { Creator, User } from "../class"
import { prisma } from "../prisma"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const course_id = request.query.course_id as string | undefined
    const user_id = request.query.user_id as string | undefined

    if (course_id) {
        try {
            const course = new Course(course_id)
            await course.init()

            if (user_id) {
                await course.viewer(user_id)
            }

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
            const creator = new Creator(owner_id)
            await creator.init()
            const courses = await creator.getCourses()
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

router.get("/user", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string | undefined

    if (user_id) {
        try {
            const user = new User(user_id)
            await user.init()
            const prisma_courses = await prisma.course.findMany({
                where: {
                    roles: { some: { id: { equals: user.role.id } } },
                },
                include: course_include,
            })
            const courses = prisma_courses.map((item) => new Course("", item))
            response.json(courses)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("user_id query param is required")
    }
})

router.post("/favorite", async (request: Request, response: Response) => {
    const data = request.body as { user_id: string; course_id: string; like?: boolean }

    try {
        const course = new Course(data.course_id)
        await course.favorite(data.user_id, data.like)
        response.json(course)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/last_message", async (request: Request, response: Response) => {
    const course_id = request.query.course_id as string | undefined

    if (course_id) {
        try {
            const course = new Course(course_id)
            await course.init()
            const message = await course.getLastMessage()
            response.json(message)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("course_id param is required")
    }
})

export default router
