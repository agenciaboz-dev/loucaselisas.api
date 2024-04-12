import express, { Express, Request, Response } from "express"
import { LoginForm } from "../types/shared/login"
import { User } from "../class"
const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as LoginForm
    console.log(data)
    const user = await User.login(data)

    response.json(user)
})

router.post("/keep_session", async (request: Request, response: Response) => {
    const data = request.body as User
    console.log(data)

    try {
        const user = new User(data.id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.json(null)
    }
})

export default router
