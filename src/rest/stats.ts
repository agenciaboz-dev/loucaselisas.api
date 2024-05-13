import express, { Express, Request, Response } from "express"
import { Course } from "../class/Course"
import { Lesson } from "../class/Course/Lesson"
const router = express.Router()

router.get("/course", async (request: Request, response: Response) => {
    const course_id = request.query.course_id as string | undefined

    if (course_id) {
        try {
            const course = new Course(course_id)
            await course.init()
            const views = await course.getViews()
            response.json({ views })
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("course_id param is required")
    }
})

router.get("/lesson", async (request: Request, response: Response) => {
    const lesson_id = request.query.lesson_id as string | undefined

    if (lesson_id) {
        try {
            const lesson = new Lesson(lesson_id)
            await lesson.init()
            const views = await lesson.getViews()
            response.json({ views })
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("lesson_id param is required")
    }
})

router.get("/courses", async (request: Request, response: Response) => {
    try {
        const courses = await Course.list()
        const views = (await Promise.all(courses.map(async (course) => await course.getViews()))).flatMap((item) => item)

        response.json(views)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/lessons", async (request: Request, response: Response) => {
    try {
        const lessons = await Lesson.list()
        const views = (await Promise.all(lessons.map(async (lesson) => await lesson.getViews()))).flatMap((item) => item)

        response.json(views)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
