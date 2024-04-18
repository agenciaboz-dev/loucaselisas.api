import express, { Express, Request, Response } from "express"
import { Lesson, LessonForm, lesson_include } from "../class/Course/Lesson"
import { prisma } from "../prisma"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
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

export default router
