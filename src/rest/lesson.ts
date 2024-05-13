import express, { Express, Request, Response } from "express"
import { Lesson, LessonForm, lesson_include } from "../class/Course/Lesson"
import { prisma } from "../prisma"
import { User } from "../class"
import { Course } from "../class/Course"
import { UploadedFile } from "express-fileupload"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const lesson_id = request.query.lesson_id as string | undefined
    const user_id = request.query.user_id as string | undefined

    if (lesson_id) {
        try {
            const lesson = new Lesson(lesson_id)
            await lesson.init()

            if (user_id) {
                await lesson.addView(user_id)
            }

            response.json(lesson)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("lesson_id param required")
    }
})

router.get("/all", async (request: Request, response: Response) => {
    const lessons = await Lesson.list()
    response.json(lessons)
})

router.get("/course", async (request: Request, response: Response) => {
    const course_id = request.query.course_id as string | undefined

    if (course_id) {
        try {
            const course = new Course(course_id)
            await course.init()
            const lessons = await course.getLessons()
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
    try {
        const data = JSON.parse(request.body.data) as LessonForm
        const media = request.files?.media as UploadedFile
        const thumb = request.files?.thumb as UploadedFile
        if (media && data.media) {
            data.media.file = media.data
            data.media.name = media.name
        }
        if (thumb && data.thumb) {
            data.thumb.file = thumb.data
            data.thumb.name = thumb.name
        }
        const lesson = Lesson.new(data)
        response.json(lesson)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    try {
        const data = (request.body.data ? JSON.parse(request.body.data) : request.body) as Partial<LessonForm> & { id: string }
        console.log(data)
        const media = request.files?.media as UploadedFile
        const thumb = request.files?.thumb as UploadedFile
        if (media && data.media) {
            data.media.file = media.data
            data.media.name = media.name
        }
        if (thumb && data.thumb) {
            data.thumb.file = thumb.data
            data.thumb.name = thumb.name
        }
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
        await lesson.addLike(data.user_id, data.like)
        const course = new Course(lesson.course_id)
        await course.init()
        if (!course.favorited_by.find((item) => item.id == data.user_id)) {
            console.log("liking course too")
            await course.addLike(data.user_id, true)
        }
        response.json(lesson)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
