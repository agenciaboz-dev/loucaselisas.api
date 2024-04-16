import express, { Express, Request, Response } from "express"
import { PaymentCard, PaymentCardForm } from "../class/PaymentCard"
import binlookup from "../api/binlookup"
import { prisma } from "../prisma"
const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const user_id = request.query.user_id as string | undefined

    if (user_id) {
        try {
            const cards = await PaymentCard.getUserCards(user_id)
            response.json(cards)
        } catch (error) {
            console.log(error)
            response.status(500).send(error)
        }
    } else {
        response.status(400).send("missing user_id")
    }
})

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as PaymentCardForm

    try {
        const bin = await binlookup.getBankData(data.number)
        console.log(bin)

        const card_prisma = await prisma.paymentcard.create({
            data: { ...data, user_id: data.user_id, bank: bin?.bank.name, flag: bin?.scheme?.toLowerCase(), id: undefined },
        })

        const card = new PaymentCard(card_prisma)
        response.json(card)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.patch("/", async (request: Request, response: Response) => {
    const data = request.body as PaymentCardForm

    try {
        const bin = await binlookup.getBankData(data.number)
        console.log(bin)
        const card_prisma = await prisma.paymentcard.update({
            where: { id: data.id },
            data: {
                ...data,
                bank: bin?.bank.name,
                flag: bin?.scheme?.toLowerCase(),
                id: undefined,
            },
        })

        const card = new PaymentCard(card_prisma)
        response.json(card)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

router.delete("/", async (request: Request, response: Response) => {
    const data = request.body as { card_id: number }

    try {
        const deleted = await prisma.paymentcard.delete({ where: { id: data.card_id } })

        response.status(200).json(deleted)
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
