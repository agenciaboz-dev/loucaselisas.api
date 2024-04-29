import express, { Express, Request, Response } from "express"
import { User, user_include } from "../../class"
import { prisma } from "../../prisma"
import { sendMail } from "../../tools/mail"
import { website_url } from "../../env"
import templates from "../../templates"

const router = express.Router()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body as { login: string }

    try {
        const user_prisma = await prisma.user.findFirst({
            where: { OR: [{ email: data.login }, { username: data.login }, { cpf: data.login }] },
            include: user_include,
        })
        if (user_prisma) {
            const user = new User("", user_prisma)
            const url = `${website_url}/redefinir-senha/${user.id}/${new Date().getTime()}`
            console.log(url)
            sendMail([user.email], "Loucas & Lisas - Redefinir senha", url, templates.email.recover_password(url))
        }

        response.status(200).send()
    } catch (error) {
        console.log(error)
        response.status(500).send(error)
    }
})

export default router
