import express, { Express, Request, Response } from "express"
import { PartialPlan, Plan, PlanForm } from "../../class/Plan"
import { PlanPurchaseForm } from "../../types/shared/PlanPurchaseForm"
import { User } from "../../class"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    try {
        const plans = await Plan.list()
        response.json(plans)
    } catch (error) {
        response.status(500).send(error)
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as PlanForm

    try {
        const plan = await Plan.new(data)
        response.json(plan)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PartialPlan

    try {
        const plan = new Plan(data.id)
        await plan.init()
        await plan.update(data)
        response.json(plan)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.post("/purchase", async (request: Request, response: Response) => {
    const data = request.body as PlanPurchaseForm
    try {
        await Plan.purchase(data)
        const user = new User(data.user_id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})



export default router
