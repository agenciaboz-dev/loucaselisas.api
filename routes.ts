import express, { Express, Request, Response } from "express"
import login from "./src/rest/login"

export const router = express.Router()

router.get("/", (req: Request, response: Response) => {
    response.status(200).json({ success: true })
})

router.use("/login", login)
