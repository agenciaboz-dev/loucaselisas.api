import express, { Express, Request, Response } from "express"
import { PartialUser, User, UserImageForm } from "../../class/User"
import { prisma } from "../../prisma"
import { ContractLog } from "../../class/Plan"
import { PaymentCardForm } from "../../class/PaymentCard"
import axios from "axios"
import binlookup from "../../api/binlookup"
import { uid } from "uid"

const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const id = request.query.id as string

    try {
        const user = new User(id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PartialUser
    console.log(data)
    try {
        const user = new User(data.id)
        await user.init()
        await user.update(data)
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.patch("/image", async (request: Request, response: Response) => {
    const data = request.body as UserImageForm
    try {
        const user = new User(data.id)
        await user.init()
        await user.updateImage(data)
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).json(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { id: string }

    try {
        await prisma.user.delete({ where: { id: data.id } })
        response.status(200).send()
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.get("/plan_logs", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string

    try {
        const logs = await ContractLog.getUserLogs(user_id)
        response.json(logs)
        console.log(logs)
    } catch (error) {
        response.status(500).send(error)
    }
})

router.post("/card", async (request: Request, response: Response) => {
    const data = request.body as { user_id: string; card: PaymentCardForm }

    try {
        const bin = await binlookup.getBankData(data.card.number)
        console.log(bin)

        await prisma.paymentcard.create({
            data: { ...data.card, user_id: data.user_id, bank: bin?.bank.name, flag: bin?.scheme?.toLowerCase(), id: undefined },
        })

        const user = new User(data.user_id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/card", async (request: Request, response: Response) => {
    const data = request.body as { user_id: string; card: PaymentCardForm }

    try {
        const bin = await binlookup.getBankData(data.card.number)
        console.log(bin)
        await prisma.paymentcard.update({
            where: { id: data.card.id },
            data: {
                ...data.card,
                bank: bin?.bank.name,
                flag: bin?.scheme?.toLowerCase(),
                id: undefined,
            },
        })
        const user = new User(data.user_id)
        await user.init()
        response.json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.delete("/card", async (request: Request, response: Response) => {
    const data = request.body as { card_id: number }

    try {
        const deleted = await prisma.paymentcard.delete({ where: { id: data.card_id } })
        const user = new User(deleted.user_id)
        await user.init()

        response.status(200).json(user)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})


export default router
