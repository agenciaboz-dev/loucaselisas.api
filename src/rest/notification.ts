import express, { Express, Request, Response } from "express"
import { Notification } from "../class/Notification"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const notification_id = request.query.notification_id as string | undefined

    if (notification_id) {
        try {
            const notification = await Notification.findById(notification_id)
            response.json(notification)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("notification_id param is required")
    }
})

router.post("/viewed", async (request: Request, response: Response) => {
    const data = request.body as { id: string }

    try {
        const notification = await Notification.findById(data.id)
        await notification.view()
        response.json(notification)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
