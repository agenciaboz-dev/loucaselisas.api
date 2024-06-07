import express, { Express, Request, Response } from "express"
import { Message } from "../class/Chat/Message"
import { Chat } from "../class/Chat/Chat"
const router = express.Router()

router.delete("/delete_message", async (request: Request, response: Response) => {
    const data = request.body as { messages: Message[]; chat_id: string }

    try {
        const deleted = await Chat.deleteMessages(data.messages, data.chat_id)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
