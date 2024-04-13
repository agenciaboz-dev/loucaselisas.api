import express, { Express, Request, Response } from "express"
import { User, UserForm } from "../../class"

const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as UserForm
    console.log(data)
    const user = await User.signup(data)
    console.log(user)
    response.status(user instanceof User ? 200 : 400).json(user)
})

export default router
