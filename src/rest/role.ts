import express, { Express, Request, Response } from "express"
import { prisma } from "../prisma"
import { Role } from "../class/Role"

const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as Partial<Role>

    try {
        const role = await Role.new(data)
        console.log(role)
        return response.json(role)
    } catch (error) {
        console.log(error)
        return response.status(500).send("Error create new role")
    }
})

export default router
