import express, { Express, Request, Response } from "express"
import { PartialUser, User, UserImageForm } from "../../class/User"
import { prisma } from "../../prisma"
import { ContractLog } from "../../class/Plan"
import forgot_password from "./forgot_password"
import { Role } from "../../class/Role"
import { Course } from "../../class/Course"
import { Creator, CreatorForm } from "../../class"

const router = express.Router()

router.use("/forgot_password", forgot_password)

router.get("/types", async (request: Request, response: Response) => {
    try {
        const roles = await Role.list()
        response.json(roles)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/", async (request: Request, response: Response) => {
    const id = request.query.id as string

    try {
        const user = new User(id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/all", async (request: Request, response: Response) => {
    try {
        const users = await User.list()
        response.json(users)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PartialUser
    console.log(data)
    try {
        const user = new User(data.id)
        await user.init()
        await user.update(data)
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.patch("/image", async (request: Request, response: Response) => {
    const data = request.body as UserImageForm
    try {
        const user = new User(data.id)
        await user.init()
        await user.updateImage(data)
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { id: string }

    try {
        await prisma.user.delete({ where: { id: data.id } })
        response.status(200).send()
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/plan_logs", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string

    try {
        const logs = await ContractLog.getUserLogs(user_id)
        response.json(logs)
        console.log(logs)
    } catch (error) {
        response.status(500).send(error)
    }
})

router.get("/messages", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string | undefined

    if (user_id) {
        try {
            const user = await new User(user_id)
            await user.init()
            const messages = await user.getMessages()
            console.log(messages)

            const data = await Promise.all(
                messages.map(async (item) => {
                    const course = await Course.getFromChat(item.chat_id)
                    return course ? { message: item, course } : null
                })
            )

            const valid_data = data.filter((item) => !!item)

            response.json(valid_data)
        } catch (error) {
            console.log("entrou")
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("user_id param is required")
    }
})

router.post("/lesson_watchtime", async (request: Request, response: Response) => {
    const data = request.body as { user_id: string; lesson_id: string; watched: number }

    try {
        const user = new User(data.user_id)
        await user.init()
        const watchedData = await user.saveWatchedTime(data.lesson_id, data.watched)
        response.json(watchedData)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/lesson_watchtime", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string | undefined
    const lesson_id = request.query.lesson_id as string | undefined

    if (user_id && lesson_id) {
        try {
            const user = new User(user_id)
            await user.init()
            const watchedTime = await user.getWatchedTime(lesson_id)
            response.json(watchedTime)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("user_id and lesson_id params are required")
    }
})

router.post("/creator", async (request: Request, response: Response) => {
    const data = request.body as { user_id: string; creator_flag: boolean }

    try {
        const user = new User(data.user_id)
        await user.init()

        if (user.creator) {
            const creator = new Creator(user.creator.id)
            await creator.init()
            await creator.update({ active: data.creator_flag })
        } else {
            if (data.creator_flag) {
                const form: CreatorForm = {
                    cover: null,
                    description: "",
                    image: null,
                    language: "pt-br",
                    nickname: user.username,
                    user_id: user.id,
                }

                const creator = await Creator.new(form)
            }
        }

        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
