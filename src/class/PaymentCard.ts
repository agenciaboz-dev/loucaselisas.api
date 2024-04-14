import { Prisma } from "@prisma/client"
import { WithoutFunctions } from "./helpers"

export type PaymentCardPrisma = Prisma.PaymentcardGetPayload<{}>

export type PaymentCardForm = WithoutFunctions<PaymentCard> 

export class PaymentCard {
    id: number
    number: string
    owner: string
    validity: string
    cvc: string
    type: "CREDIT" | "DEBIT"

    bank: string | null
    flag: string | null

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
