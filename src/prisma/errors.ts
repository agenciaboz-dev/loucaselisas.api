import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Socket } from "socket.io"

export const user_errors = [
    { key: "username", message: "nome de usuário já cadastrado" },
    { key: "email", message: "erro: este e-mail já está cadastrado" },
    { key: "cpf", message: "erro: cpf já cadastrado" },
    { key: "google_id", message: "erro: conta google já cadastrada" },
    { key: "user_id", preffix: "Creator", message: "erro: usuário já é um criador" },
]

export const handlePrismaError = (error: unknown, response?: { socket: Socket; event: string }) => {
    if (error instanceof PrismaClientKnownRequestError) {
        const target = error.meta?.target as string | undefined
        const match = target?.match(/_(.*)_/s)
        if (match) {
            const key = match[1]
            const message = user_errors.find((item) => {
                if (item.key == key) {
                    if (item.preffix) {
                        const preffix = match.input?.split("_")[0]
                        return preffix == item.preffix
                    }
                    return true
                }
            })?.message
            if (message) {
                response?.socket.emit(response.event, message)
            } else {
                console.log("error not formatted, update this handler including a message for it")
                console.log(target)
            }
            return true
        } else {
            console.log(error)
        }
    }

    return
}
