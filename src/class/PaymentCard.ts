import { Prisma } from "@prisma/client"

export type PaymentCardPrisma = Prisma.PaymentcardGetPayload<{}>

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
