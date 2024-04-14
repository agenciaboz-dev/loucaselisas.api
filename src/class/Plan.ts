import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { PlanPurchaseForm } from "../types/shared/PlanPurchaseForm"

export type PlanPrisma = Prisma.PlanGetPayload<{}>

export const plan_contract_include = Prisma.validator<Prisma.PlanContractInclude>()({ plan_data: true })
export type PlanContractPrisma = Prisma.PlanContractGetPayload<{ include: typeof plan_contract_include }>

export class PlanContract {
    id: number
    start_date: string
    end_date: string
    paid: number

    plan_data: Plan

    constructor(data: PlanContractPrisma) {
        this.id = data.id
        this.end_date = data.end_date
        this.paid = data.paid
        this.plan_data = new Plan(0, data.plan_data)
        this.start_date = data.start_date
    }
}

export class Plan {
    id: number
    name: string
    price: number
    duration: string
    description: string

    static async list() {
        const plans = await prisma.plan.findMany()
        return plans
    }

    static async purchase(data: PlanPurchaseForm) {
        const plan = new Plan(data.plan_id)
        await plan.init()
        await prisma.planContract.deleteMany({ where: { user_id: data.user_id } })

        const now = new Date().getTime()

        const new_contract = await prisma.planContract.create({
            data: {
                start_date: now.toString(),
                end_date: (now + Number(plan.duration)).toString(),
                paid: plan.price,
                plan_id: plan.id,
                user_id: data.user_id,
            },
            include: plan_contract_include,
        })

        const plan_contract = new PlanContract(new_contract)
        return plan_contract
    }

    constructor(id: number, data?: PlanPrisma) {
        this.id = id
        if (data) this.load(data)
    }

    load(data: PlanPrisma) {
        this.id = data.id
        this.duration = data.duration
        this.name = data.name
        this.price = data.price
        this.description = data.description
    }

    async init() {
        const plan_prisma = await prisma.plan.findUnique({ where: { id: this.id } })
        if (plan_prisma) {
            this.load(plan_prisma)
        }
    }
}
