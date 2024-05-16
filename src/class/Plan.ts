import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { PlanPurchaseForm } from "../types/shared/PlanPurchaseForm"
import { WithoutFunctions } from "./helpers"

export type PlanPrisma = Prisma.PlanGetPayload<{}>

export const plan_contract_include = Prisma.validator<Prisma.PlanContractInclude>()({ plan_data: true })
export type PlanContractPrisma = Prisma.PlanContractGetPayload<{ include: typeof plan_contract_include }>

export const contract_log_include = Prisma.validator<Prisma.ContractLogsInclude>()({ plan: true })
export type ContractLogPrisma = Prisma.ContractLogsGetPayload<{ include: typeof contract_log_include }>

export type PlanForm = Omit<WithoutFunctions<Plan>, "id">
export type PartialPlan = Partial<PlanForm> & { id: number }

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
    active: boolean

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

        await prisma.contractLogs.create({
            data: {
                start_date: new_contract.start_date,
                end_date: new_contract.end_date,
                paid: new_contract.paid,
                plan_id: plan.id,
                user_id: data.user_id,
            },
        })

        const plan_contract = new PlanContract(new_contract)
        return plan_contract
    }

    static async new(data: PlanForm) {
        const prisma_plan = await prisma.plan.create({ data: { ...data } })
        const plan = new Plan(0, prisma_plan)
        return plan
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
        this.active = data.active
    }

    async init() {
        const plan_prisma = await prisma.plan.findUnique({ where: { id: this.id } })
        if (plan_prisma) {
            this.load(plan_prisma)
        }
    }

    async update(data: PartialPlan) {
        const updated = await prisma.plan.update({ where: { id: this.id }, data: { ...data } })
        this.load(updated)
    }
}

export class ContractLog {
    id: number
    start_date: string
    end_date: string
    paid: number
    plan: Plan

    static async getUserLogs(user_id: string) {
        const contract_logs_prisma = await prisma.contractLogs.findMany({ where: { user_id }, include: contract_log_include })
        const logs = contract_logs_prisma.map((item) => new ContractLog(item))
        return logs
    }

    constructor(data: ContractLogPrisma) {
        this.id = data.id
        this.end_date = data.end_date
        this.paid = data.paid
        this.plan = new Plan(0, data.plan)
        this.start_date = data.start_date
    }
}
