import express, { Express, Request, Response } from "express"
import { Lesson, LessonForm, lesson_include } from "../class/Course/Lesson"
import { prisma } from "../prisma"
import { User } from "../class"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const lesson_id = request.query.lesson_id as string | undefined

    if (lesson_id) {
        try {
            const lesson = new Lesson(lesson_id)
            await lesson.init()
            response.json(lesson)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("lesson_id param required")
    }
})

router.get("/course", async (request: Request, response: Response) => {
    const course_id = request.query.course_id as string | undefined

    if (course_id) {
        try {
            const data = await prisma.lesson.findMany({ where: { course_id }, include: lesson_include })
            const lessons = data.map((item) => new Lesson("", item))
            response.json(lessons)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("missing course_id param")
    }
})

router.get("/liked", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string | undefined

    if (user_id) {
        const user = new User(user_id)
        await user.init()
        const data = await user.getLikedLessons()
        response.json(data)
    } else {
        response.status(400).send("user_id param is required")
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as LessonForm

    try {
        const lesson = Lesson.new(data)
        response.json(lesson)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as Partial<LessonForm> & { id: string }

    try {
        const lesson = new Lesson(data.id)
        await lesson.init()
        await lesson.update(data)

        response.json(lesson)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { lesson_id: string }
    try {
        const deleted = await prisma.lesson.delete({ where: { id: data.lesson_id } })
        response.json(deleted)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.post("/favorite", async (request: Request, response: Response) => {
    const data = request.body as { user_id: string; lesson_id: string; like?: boolean }

    try {
        const lesson = new Lesson(data.lesson_id)
        await lesson.favorite(data.user_id, data.like)
        response.json(lesson)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
