import { Prisma } from "@prisma/client";
import { user as include } from "../prisma/include"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { SignupForm } from "../types/user/signup"
import { uid } from "uid"
import { LoginForm } from "../types/user/login"

export type UserPrisma = Prisma.UserGetPayload<{ include: typeof include }>

export class User {
    id: string
    username: string
    email: string
    password: string
    name: string
    cpf: string
    birth: Date
    phone: string
    pronoun: string

    image: string | null

    google_id: string | null
    google_token: string | null

    // missing creator_id and creator

    constructor(user_prisma: UserPrisma) {
        this.buildInstance(user_prisma)
    }

    static async signup(socket: Socket, data: SignupForm) {
        const user_prisma = await prisma.user.create({
            data: { ...data, id: uid() },
            include,
        })

        const user = new User(user_prisma)
        socket.emit("user:signup", user)
    }

    static async list(socket: Socket) {
        const users_prisma = await prisma.user.findMany({ include })
        const users = users_prisma.map((user) => new User(user))

        socket.emit("user:list", users)
    }

    static async login(socket: Socket, data: LoginForm) {
        const user_prisma = await prisma.user.findFirst({
            where: { OR: [{ email: data.login }, { username: data.login }, { cpf: data.login }], password: data.password },
        })

        socket.emit("user:login", user_prisma ? new User(user_prisma) : null)
    }

    buildInstance(user_prisma: UserPrisma) {
        this.id = user_prisma.id
        this.cpf = user_prisma.cpf
        this.birth = new Date(Number(user_prisma.birth))
        this.username = user_prisma.username
        this.email = user_prisma.email
        this.name = user_prisma.name
        this.password = user_prisma.password
        this.phone = user_prisma.phone
        this.pronoun = user_prisma.pronoun
        this.image = user_prisma.image
        this.google_id = user_prisma.google_id
        this.google_token = user_prisma.google_token
    }

    async update(data: Partial<UserPrisma>) {
        const user_prisma = await prisma.user.update({
            where: { id: this.id },
            data,
            include: include,
        })

        this.buildInstance(user_prisma)
    }
}