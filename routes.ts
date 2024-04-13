import express, { Express, Request, Response } from "express"
import login from "./src/rest/user/login"
import signup from "./src/rest/user/signup"

export const router = express.Router()

router.get("/", (req: Request, response: Response) => {
    response.status(200).json({ success: true })
})

router.use("/login", login)
router.use("/signup", signup)
