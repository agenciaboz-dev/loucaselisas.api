import { Prisma } from "@prisma/client";
import { user as include } from "../prisma/include"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { SignupForm } from "../types/user/signup"
import { uid } from "uid"
import { LoginForm } from "../types/user/login"
import { Creator, CreatorPrisma } from "./Creator"
import { Course } from "./Course"
import { PaymentCard } from "./PaymentCard"

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
    uf: string
    admin: boolean

    image: string | null
    cover: string | null
    bio: string | null

    google_id: string | null
    google_token: string | null

    creator_id: string | null
    creator: Creator | null = null

    favorite_creators: Creator[] = []
    favorite_courses: Course[] = []

    payment_cards: PaymentCard[] = []

    constructor(id: string) {
        this.id = id
    }

    async init() {
        const user_prisma = await prisma.user.findUnique({ where: { id: this.id }, include })
        if (user_prisma) {
            await this.load(user_prisma)
        } else {
            throw "usuário não encontrado"
        }
    }

    static async update(data: Partial<UserPrisma> & { id: string }, socket: Socket) {
        const user = new User(data.id)
        await user.init()
        user.update(data, socket)
    }

    static async signup(socket: Socket, data: SignupForm) {
        const user_prisma = await prisma.user.create({
            data: { ...data, id: uid() },
            include,
        })

        const user = new User(user_prisma.id)
        await user.init()
        socket.emit("user:signup", user)
    }

    static async list(socket: Socket) {
        const users_prisma = await prisma.user.findMany({ include })
        const users = await Promise.all(
            users_prisma.map(async (user) => {
                const new_user = new User(user.id)
                await new_user.init()
                return new_user
            })
        )

        socket.emit("user:list", users)
    }

    static async login(socket: Socket, data: LoginForm) {
        const user_prisma = await prisma.user.findFirst({
            where: { OR: [{ email: data.login }, { username: data.login }, { cpf: data.login }], password: data.password },
            include,
        })

        if (user_prisma) {
            const user = new User(user_prisma.id)
            await user.init()
            socket.emit("user:login", user)
        } else {
            socket.emit("user:login", null)
        }
    }

    async load(user_prisma: UserPrisma) {
        this.id = user_prisma.id
        this.cpf = user_prisma.cpf
        this.birth = new Date(Number(user_prisma.birth))
        this.username = user_prisma.username
        this.email = user_prisma.email
        this.name = user_prisma.name
        this.password = user_prisma.password
        this.phone = user_prisma.phone
        this.pronoun = user_prisma.pronoun
        this.uf = user_prisma.uf
        this.admin = user_prisma.admin

        this.image = user_prisma.image
        this.cover = user_prisma.cover

        this.google_id = user_prisma.google_id
        this.google_token = user_prisma.google_token

        this.creator_id = user_prisma.creator_id

        if (user_prisma.creator_id) {
            const creator = new Creator(user_prisma.creator_id)
            await creator.init()
            this.creator = creator
        }

        const favorite_creators = await Promise.all(
            user_prisma.favorite_creators.map(async (creator) => {
                const new_creator = new Creator(creator.id)
                await new_creator.init()
                return new_creator
            })
        )
        this.favorite_creators = favorite_creators

        const favorite_courses: Course[] = []
        this.favorite_courses = favorite_courses
    }

    async update(data: Partial<UserPrisma>, socket?: Socket) {
        try {
            const user_prisma = await prisma.user.update({
                where: { id: this.id },
                data: {
                    ...data,

                    courses: {
                        disconnect: data.courses?.map((course) => ({ id: course.id })),
                        connect: data.courses?.map((course) => ({ id: course.id })),
                    },
                    favorite_courses: {
                        disconnect: data.favorite_courses?.map((course) => ({ id: course.id })),
                        connect: data.favorite_courses?.map((course) => ({ id: course.id })),
                    },
                    favorite_creators: {
                        disconnect: data.favorite_creators?.map((creator) => ({ id: creator.id })),
                        connect: data.favorite_creators?.map((creator) => ({ id: creator.id })),
                    },
                    payment_cards: {
                        disconnect: data.payment_cards?.map((creator) => ({ id: creator.id })),
                        connect: data.payment_cards?.map((creator) => ({ id: creator.id })),
                    },
                    creator: {},
                },
                include: include,
            })

            await this.load(user_prisma)

            socket && socket.emit("user:update", this)
        } catch (error) {
            console.log(error)
        }
    }
}