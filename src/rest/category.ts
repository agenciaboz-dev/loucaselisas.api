import express, { Express, Request, Response } from "express"
import { Category } from "../class/Category"
const router = express.Router()

router.get("/list", async (request: Request, response: Response) => {
    try {
        const categories = await Category.list()
        response.json(categories)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
