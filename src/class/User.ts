import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { uid } from "uid"
import { LoginForm } from "../types/user/login"
import { Course } from "./Course"
import { PaymentCard } from "./PaymentCard"
import { ImageUpload, PickDiff, WithoutFunctions } from "./helpers"
import { saveImage } from "../tools/saveImage"
import { handlePrismaError } from "../prisma/errors"
import { Creator, Student } from "./index"

export const user_include = Prisma.validator<Prisma.UserInclude>()({
    courses: true,
    creator: { include: { user: true, courses: true, categories: true, favorited_by: true } },
    student: { include: { user: true, courses: true } },
    favorite_courses: true,
    favorite_creators: { include: { user: true, courses: true, categories: true, favorited_by: true } },
    payment_cards: true,
})
export type UserPrisma = Prisma.UserGetPayload<{ include: typeof user_include }>

export type UserForm = Omit<WithoutFunctions<User>, "id" | "admin" | "creator_id" | "favorite_creators" | "favorite_courses" | "payment_cards"> & {
    image?: ImageUpload
    cover?: ImageUpload
}
export class User {
    id: string
    username: string
    email: string
    password: string
    name: string
    cpf: string
    birth: string
    phone: string
    pronoun: string
    uf: string
    admin: boolean

    image: string | null
    cover: string | null
    bio: string | null

    google_id: string | null
    google_token: string | null

    favorite_creators: Creator[] = []
    favorite_courses: Course[] = []

    payment_cards: PaymentCard[] = []

    creator: Creator | null
    student: Student | null

    constructor(id: string, user_prisma?: UserPrisma) {
        user_prisma ? this.load(user_prisma) : (this.id = id)
    }

    async init() {
        const user_prisma = await prisma.user.findUnique({ where: { id: this.id }, include: user_include })
        if (user_prisma) {
            this.load(user_prisma)
        } else {
            throw "usuário não encontrado"
        }
    }

    static async update(data: Partial<UserPrisma> & { id: string }, socket: Socket) {
        const user = new User(data.id)
        await user.init()
        user.update(data, socket)
    }

    static async updateImage(data: { id: string; image?: ImageUpload; cover?: ImageUpload }, socket: Socket) {
        const user = new User(data.id)
        await user.init()
        user.updateImage(data, socket)
    }

    static async signup(socket: Socket, data: UserForm) {
        try {
            const user_prisma = await prisma.user.create({
                data: {
                    ...data,
                    image: null,
                    cover: null,
                    creator: {},
                    student: {},

                    id: uid(),
                },
                include: user_include,
            })

            const user = new User(user_prisma.id)
            user.load(user_prisma)
            await user.updateImage(data)

            socket.emit("user:signup", user)
            socket.broadcast.emit("user:update", user)
        } catch (error) {
            handlePrismaError(error, { socket, event: "user:signup:error" }) || console.log(error)
        }
    }

    static async list(socket: Socket) {
        const users_prisma = await prisma.user.findMany({ include: user_include })
        const users = users_prisma.map((item) => {
            const user = item.creator ? new Creator(item.creator.id, { ...item.creator, ...item }) : new User(item.id, item)
            return user
        })

        socket.emit("user:list", users)
    }

    static async login(socket: Socket, data: LoginForm) {
        const user_prisma = await prisma.user.findFirst({
            where: { OR: [{ email: data.login }, { username: data.login }, { cpf: data.login }], password: data.password },
            include: user_include,
        })

        if (user_prisma) {
            const user = user_prisma.creator
                ? new Creator(user_prisma.creator.id, { ...user_prisma.creator, ...user_prisma })
                : new User(user_prisma.id, user_prisma)

            socket.emit("user:login", user)
        } else {
            socket.emit("user:login", null)
        }
    }

    load(data: UserPrisma, omit?: { creator?: boolean; student?: boolean }) {
        this.id = data.id
        this.cpf = data.cpf
        this.birth = data.birth
        this.username = data.username
        this.email = data.email
        this.name = data.name
        this.password = data.password
        this.phone = data.phone
        this.pronoun = data.pronoun
        this.uf = data.uf
        this.admin = data.admin

        this.image = data.image
        this.cover = data.cover

        this.google_id = data.google_id
        this.google_token = data.google_token


        this.favorite_creators = data.favorite_creators.map((item) => new Creator("", { ...item, ...data }))

        const favorite_courses: Course[] = []
        this.favorite_courses = favorite_courses

        this.payment_cards = data.payment_cards.map((item) => new PaymentCard(item))

        if (!omit?.creator) {
            this.creator = data.creator ? new Creator(data.creator.id, { ...data.creator, ...data }) : null
        }

        if (!omit?.student) {
            this.student = data.student ? new Student(data.student.id, { ...data.student, ...data }) : null
        }
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
                    student: {},
                },
                include: user_include,
            })

            this.load(user_prisma)

            if (socket) {
                socket.emit("user:update", this)
                socket.broadcast.emit("user:update", this)
            }
        } catch (error) {
            handlePrismaError(error, socket ? { socket, event: "user:update:error" } : undefined) || console.log(error)
        }
    }

    async updateImage(data: { image?: ImageUpload; cover?: ImageUpload }, socket?: Socket) {
        try {
            if (data.image) {
                const url = saveImage(`/users/${this.id}`, data.image)
                await this.update({ image: url }, socket)
            }

            if (data.cover) {
                const url = saveImage(`/users/${this.id}`, data.cover)
                await this.update({ cover: url }, socket)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

