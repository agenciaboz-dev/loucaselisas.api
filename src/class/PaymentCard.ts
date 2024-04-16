import { Prisma } from "@prisma/client"
import { WithoutFunctions } from "./helpers"
import { prisma } from "../prisma"

export type PaymentCardPrisma = Prisma.PaymentcardGetPayload<{}>

export type PaymentCardForm = WithoutFunctions<PaymentCard> & { user_id: string }

export class PaymentCard {
    id: number
    number: string
    owner: string
    validity: string
    cvc: string
    type: "CREDIT" | "DEBIT"

    bank: string | null
    flag: string | null

    static async getUserCards(user_id: string) {
        const prisma_cards = await prisma.paymentcard.findMany({ where: { user_id } })
        const cards = prisma_cards.map((item) => new PaymentCard(item))
        return cards
    }

    constructor(data: PaymentCardPrisma) {
        this.id = data.id
        this.cvc = data.cvc
        this.number = data.number
        this.owner = data.owner
        this.type = data.type
        this.validity = data.validity
        this.bank = data.bank
        this.flag = data.flag
    }
}
