import express, { Express, Request, Response } from "express"
import { prisma } from "../prisma"
import { PartialRole, Role, RoleForm, RolePrisma } from "../class/Role"

const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as RoleForm

    try {
        const role = await Role.create(data)
        console.log(role)
        return response.json(role)
    } catch (error) {
        console.log(error)
        return response.status(500).send("Error create new role")
    }
})

// router.post("/update", async (request: Request, response: Response) => {
//     const data = request.body as Partial<Role>

//     try {
//         const role = await Role.update(data)
//         console.log(role)
//         return response.json(role)
//     } catch (error) {
//         console.log(error)
//         return response.status(500).send("Error create new role")
//     }
// })

router.get("/delete", async (request: Request, response: Response) => {
    const data = request.query.id as number | undefined

    try {
        const role = await Role.remove(Number(data))
        console.log(role)
        return response.json(data)
    } catch (error) {}
})

export default router
