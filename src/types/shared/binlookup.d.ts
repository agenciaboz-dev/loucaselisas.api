declare interface BinlookupData {
    number: {
        length: number
        luhn: boolean
    }
    scheme: string
    type: "debit" | "credit"
    brand: string
    prepaid: boolean
    country: {
        numeric: string
        alpha2: string
        name: string
        emoji: string
        currency: string
        latitude: number
        longitude: number
    }
    bank: {
        name: string
        url: string
        phone: string
        city: string
    }
}
