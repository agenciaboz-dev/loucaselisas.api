import express, { Express, Request, Response } from "express"
import { PartialUser, User, UserImageForm } from "../../class/User"
import { prisma } from "../../prisma"
import { ContractLog } from "../../class/Plan"
import forgot_password from "./forgot_password"
import { Role } from "../../class/Role"
import { Course } from "../../class/Course"

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

export default router
