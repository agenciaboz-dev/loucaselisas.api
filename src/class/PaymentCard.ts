import { Prisma } from "@prisma/client"
import { WithoutFunctions } from "./helpers"

export type PaymentCardPrisma = Prisma.PaymentcardGetPayload<{}>

export type PaymentCardForm = WithoutFunctions<PaymentCard> 

export class PaymentCard {
    id: string
    number: string
    owner: string
    validity: string
    cvc: string
    type: string

    constructor(data: PaymentCardPrisma) {
        this.id = data.id
        this.cvc = data.cvc
        this.number = data.number
        this.owner = data.owner
        this.type = data.type
        this.validity = data.validity
    }
}
