import { Status } from "./server/class/Course"

export interface StatusForm {
    id: string
    status: Status
    declined_reason?: string
    price?: number
}
