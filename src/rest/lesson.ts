import express, { Express, Request, Response } from "express"
import { Lesson, LessonForm } from "../class/Course/Lesson"
const router = express.Router()

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

export default router
