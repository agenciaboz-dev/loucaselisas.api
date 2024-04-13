import ip from "ip"
import { env } from "../env"

export const getLocalUrl = () => {
    const local_ip = ip.address()
    const port = process.env.PORT
    const url = `${env == "dev" ? `http://${local_ip}:${port}` : `https://app.agencyboz.com:${port}`}`
    console.log(url)
    return url
}
