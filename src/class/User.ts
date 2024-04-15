import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { Socket } from "socket.io"
import { uid } from "uid"
import { LoginForm } from "../types/shared/login"
import { Course, course_include } from "./Course"
import { PaymentCard, PaymentCardForm } from "./PaymentCard"
import { FileUpload, PickDiff, WithoutFunctions } from "./helpers"
import { saveFile } from "../tools/saveFile"
import { handlePrismaError } from "../prisma/errors"
import { Creator, CreatorForm, Student, creator_include } from "./index"
import { Role, role_include } from "./Role"
import { ContractLog, Plan, PlanContract, contract_log_include, plan_contract_include } from "./Plan"

export const user_include = Prisma.validator<Prisma.UserInclude>()({
    creator: { include: creator_include },
    student: { include: { user: true, courses: { include: course_include } } },
    favorite_courses: true,
    favorite_creators: { include: creator_include },
    payment_cards: true,
    role: { include: role_include },
    plan: { include: plan_contract_include },
})
export type UserPrisma = Prisma.UserGetPayload<{ include: typeof user_include }>
export interface UserImageForm {
    id: string
    image?: FileUpload | null
    cover?: FileUpload | null
}

export type UserForm = Omit<
    WithoutFunctions<User>,
    | "id"
    | "plan"
    | "plan_history"
    | "admin"
    | "favorite_creators"
    | "favorite_courses"
    | "payment_cards"
    | "creator"
    | "student"
    | "role"
    | "cover"
    | "image"
    | "payment_cards"
> & {
    image: FileUpload | null
    cover: FileUpload | null
    student: boolean
    creator: CreatorForm | null
    payment_cards: PaymentCardForm[]
}
export type PartialUser = Partial<User> & { id: string }
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
    instagram: string | null
    tiktok: string | null
    profession: string | null
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

    plan: PlanContract | null
    role: Role

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

    static async update(data: PartialUser, socket: Socket) {
        console.log(data)
        const user = new User(data.id)
        await user.init()
        await user.update(data, socket)
    }

    static async updateImage(data: UserImageForm & { id: string }, socket: Socket) {
        const user = new User(data.id)
        await user.init()
        user.updateImage(data, socket)
    }

    static async signup(data: UserForm, socket?: Socket) {
        try {
            if (!(await Role.existsDefault())) {
                await Role.createDefault(socket)
            }
            const user_prisma = await prisma.user.create({
                data: {
                    ...data,
                    image: null,
                    cover: null,
                    creator: data.creator ? { create: { id: uid(), ...data.creator, favorited_by: undefined, owned_courses: {} } } : {},
                    student: data.student ? { create: { id: uid() } } : {},
                    role: { connect: { id: 1 } },
                    payment_cards: {},
                    plan: {},
                    plan_history: {},

                    id: uid(),
                },
                include: user_include,
            })

            const user = new User(user_prisma.id)
            user.load(user_prisma)
            if (data.image || data.cover) {
                await user.updateImage({ ...data, id: user.id })
            }

            socket?.emit("user:signup", user)
            socket?.broadcast.emit("user:update", user)
            return user
        } catch (error) {
            const message = handlePrismaError(error)
            socket?.emit("user:signup:error", message)
            return message
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

    static async login(data: LoginForm & { admin?: boolean }, socket?: Socket) {
        const user_prisma = await prisma.user.findFirst({
            where: { OR: [{ email: data.login }, { username: data.login }, { cpf: data.login }], password: data.password, admin: data.admin },
            include: user_include,
        })
        console.log(user_prisma)

        if (user_prisma) {
            const user = new User(user_prisma.id, user_prisma)

            socket?.emit("user:login", user)
            return user
        } else {
            socket?.emit("user:login", null)
        }

        return null
    }

    load(data: UserPrisma) {
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
        this.bio = data.bio

        this.instagram = data.instagram
        this.tiktok = data.tiktok
        this.profession = data.profession
        this.image = data.image
        this.cover = data.cover

        this.google_id = data.google_id
        this.google_token = data.google_token

        this.favorite_creators = data.favorite_creators.map((item) => new Creator(item.id, item))

        const favorite_courses: Course[] = []
        this.favorite_courses = favorite_courses

        this.payment_cards = data.payment_cards.map((item) => new PaymentCard(item))

        this.creator = data.creator ? new Creator(data.creator.id, data.creator) : null
        this.student = data.student ? new Student(data.student.id, data.student) : null

        this.role = new Role(data.role)
        this.plan = data.plan ? new PlanContract(data.plan) : null
    }

    async update(data: Partial<User>, socket?: Socket) {
        try {
            const user_prisma = await prisma.user.update({
                where: { id: this.id },
                data: {
                    ...data,
                    favorite_courses: {
                        disconnect: data.favorite_courses?.map((course) => ({ id: course.id })),
                        connect: data.favorite_courses?.map((course) => ({ id: course.id })),
                    },
                    favorite_creators: {
                        disconnect: data.favorite_creators?.map((creator) => ({ id: creator.id })),
                        connect: data.favorite_creators?.map((creator) => ({ id: creator.id })),
                    },
                    payment_cards: {},
                    creator: {},
                    student: {},
                    role: {},
                    plan: {},
                    plan_history: {},
                    role_id: undefined,
                },
                include: user_include,
            })

            if (data.role) {
                await this.role.update(data.role)
                socket?.emit("role:update", this.role)
                socket?.broadcast.emit("role:update", this.role)
            }

            this.load(user_prisma)

            if (socket) {
                socket.emit("user:update", this)
                socket.emit("user:update:success")
                socket.broadcast.emit("user:update", this)
                console.log("user:update")
            }
        } catch (error) {
            const message = handlePrismaError(error)
            socket?.emit("user:update:error", message)
            return message
        }
    }

    async updateImage(data: UserImageForm, socket?: Socket) {
        try {
            if (data.image) {
                const url = saveFile(`/users/${this.id}`, data.image)
                await this.update({ image: url }, socket)
            }

            if (data.cover) {
                const url = saveFile(`/users/${this.id}`, data.cover)
                await this.update({ cover: url }, socket)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

