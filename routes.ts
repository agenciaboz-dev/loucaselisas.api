import express, { Express, Request, Response } from "express"
// import user from "./src/user"

export const router = express.Router()

router.get('/', (req: Request, response: Response) => {
    response.status(200).json({success: true})
})

// router.use("/user", user)
