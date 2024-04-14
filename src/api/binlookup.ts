import axios, { AxiosError } from "axios"

const api = axios.create({ baseURL: "https://lookup.binlist.net/" })

const getBankData = async (card_number: string) => {
    try {
        const bin = card_number.slice(0, 8)
        const response = await api.get(bin)
        const data = response.data
        return data as BinlookupData
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status == 429) {
                console.log("bateu as 5 chamadas de cartão por hora")
                return
            }
        }
        console.log(error)
    }
}

export default { getBankData }
