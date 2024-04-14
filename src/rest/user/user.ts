import express, { Express, Request, Response } from "express"
import { PartialUser, User, UserImageForm } from "../../class/User"
import { prisma } from "../../prisma"

const router = express.Router()

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


export default router
