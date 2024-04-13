import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const user_errors = [
    { key: "username", message: "nome de usuário já cadastrado" },
    { key: "email", message: "este e-mail já está cadastrado" },
    { key: "cpf", message: "cpf já cadastrado" },
    { key: "google_id", message: "conta google já cadastrada" },
    { key: "user_id", preffix: "Creator", message: "usuário já é um criador" },
]

export const handlePrismaError = (error: unknown) => {
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
                return message
            } else {
                console.log("error not formatted, update this handler including a message for it")
                console.log(target)
                return target
            }
        } else {
            console.log(error)
        }
    }

    return
}
