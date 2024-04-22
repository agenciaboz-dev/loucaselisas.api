import express, { Express, Request, Response } from "express"
import { Creator, CreatorForm, User } from "../../class"
import { CreatorImageForm, PartialCreator } from "../../class/Creator"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const creator_id = request.query.id as string | undefined

    if (creator_id) {
        try {
            const creator = new Creator(creator_id)
            await creator.init()
            response.json(creator)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("missing creator_id")
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as CreatorForm
    try {
        const creator = await Creator.new(data)
        response.json(creator)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { creator_id: string }

    try {
        const deleted = await Creator.delete(data.creator_id)
        response.json({ deleted: !!deleted })
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PartialCreator
    console.log(data)

    try {
        const creator = new Creator(data.id)
        await creator.init()
        await creator.update(data)
        const user = new User(creator.user_id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/image", async (request: Request, response: Response) => {
    const data = request.body as CreatorImageForm
    try {
        const creator = new Creator(data.id)
        await creator.init()
        await creator.updateImage(data)
        const user = new User(creator.user_id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.get("/list", async (request: Request, response: Response) => {
    try {
        const creators = await Creator.list()
        response.json(creators)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/statistics", async (request: Request, response: Response) => {
    const creator_id = request.query.creator_id as string | undefined

    if (creator_id) {
        try {
            const creator = new Creator(creator_id)
            await creator.init()
            const statistics = await creator.getStatistics()
            response.json(statistics)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("creator_id param is required")
    }
})

router.get("/lessons", async (request: Request, response: Response) => {
    const creator_id = request.query.creator_id as string | undefined
    if (creator_id) {
        try {
            const creator = new Creator(creator_id)
            await creator.init()
            const lessons = await creator.getLessons()
            response.json(lessons)
        } catch (error) {}
    } else {
        response.status(400).send("creator_id param is required")
    }
})

export default router
