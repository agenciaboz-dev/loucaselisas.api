import express, { Express, Request, Response } from "express"
import { Creator, CreatorForm } from "../../class"
const router = express.Router()

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

export default router
