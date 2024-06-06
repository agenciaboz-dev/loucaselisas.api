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
import { Lesson, lesson_include } from "./Course/Lesson"
import { Message, message_include } from "./Chat/Message"
import expo from "../api/expo"
import { Notification } from "./Notification"

export const user_include = Prisma.validator<Prisma.UserInclude>()({
    creator: { include: creator_include },
    student: { include: { user: true, courses: { include: course_include } } },
    favorite_courses: { select: { id: true } },
    favorite_creators: true,
    payment_cards: true,
    role: { include: role_include },
    plan: { include: plan_contract_include },
    notifications: true,
    _count: { select: { lessons_likes: true } },
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
    | "liked_lessons"
    | "created_at"
    | "notifications"
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
    created_at: string

    admin: boolean
    instagram: string | null
    tiktok: string | null
    profession: string | null
    image: string | null
    cover: string | null
    bio: string | null

    google_id: string | null
    google_token: string | null
    expoPushToken: string | null

    favorite_creators: string[] = []
    favorite_courses: { id: string }[] = []

    payment_cards: PaymentCard[] = []

    creator: Creator | null
    student: Student | null

    plan: PlanContract | null
    role: Role

    liked_lessons: number

    notifications: Notification[]

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

    static async getAdmins() {
        const data = await prisma.user.findMany({ where: { admin: true }, include: user_include })
        const admins = data.map((item) => new User("", item))
        return admins
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

    static async list() {
        const data = await prisma.user.findMany({ include: user_include })
        const users = data.map((item) => new User("", item))
        return users
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
                    created_at: new Date().getTime().toString(),
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

    static async login(data: LoginForm & { admin?: boolean }, socket?: Socket) {
        const user_prisma = await prisma.user.findFirst({
            where: {
                OR: [{ email: data.login }, { username: data.login }, { cpf: data.login }],
                password: data.password,
                admin: data.admin,
            },
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

    static async findById(id: string) {
        const data = await prisma.user.findUnique({ where: { id }, include: user_include })
        if (!data) throw "usuário não encontrado"
        return new User("", data)
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
        this.created_at = data.created_at

        this.instagram = data.instagram
        this.tiktok = data.tiktok
        this.profession = data.profession
        this.image = data.image
        this.cover = data.cover

        this.google_id = data.google_id
        this.google_token = data.google_token
        this.expoPushToken = data.expoPushToken

        this.favorite_creators = data.favorite_creators.map((item) => item.id)

        this.favorite_courses = data.favorite_courses

        this.payment_cards = data.payment_cards.map((item) => new PaymentCard(item))

        this.creator = data.creator ? new Creator(data.creator.id, data.creator) : null
        this.student = data.student ? new Student(data.student.id, data.student) : null

        this.role = new Role(data.role)
        this.plan = data.plan ? new PlanContract(data.plan) : null

        this.liked_lessons = data._count.lessons_likes
        this.notifications = data.notifications.map((item) => new Notification(item))
    }

    async update(data: Partial<User>, socket?: Socket) {
        try {
            const user_prisma = await prisma.user.update({
                where: { id: this.id },
                data: {
                    ...data,
                    role: data.role ? { connect: { id: data.role.id } } : undefined,
                    notifications: undefined,
                    favorite_courses: undefined,
                    favorite_creators: undefined,
                    payment_cards: undefined,
                    creator: undefined,
                    student: undefined,
                    plan: undefined,
                    plan_history: undefined,
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

    async getLikedLessons() {
        const data = await prisma.lesson.findMany({
            where: { AND: [{ status: "active" }, { course: { status: "active" } }, { likes: { some: { id: this.id } } }] },
            include: lesson_include,
        })
        const lessons = data.map((item) => new Lesson("", item))

        const courses_data = await prisma.course.findMany({
            where: { lessons: { some: { id: { in: lessons.map((item) => item.id) } } } },
            include: course_include,
        })

        const courses = courses_data.map((item) => new Course("", item))

        return { lessons, courses }
    }

    async getMessages() {
        const data = await prisma.message.findMany({
            where: { user_id: this.id },
            orderBy: { datetime: "desc" },
            include: message_include,
        })

        const messages = data.map((item) => new Message(item))
        return messages
    }

    async getWatchedTime(lesson_id: string) {
        const data = await prisma.lessonWatched.findFirst({ where: { lesson_id, user_id: this.id } })
        return data?.watchedTime
    }

    async saveWatchedTime(lesson_id: string, watchedTime: number) {
        const exists = await prisma.lessonWatched.findFirst({ where: { lesson_id, user_id: this.id } })
        if (exists) {
            const data = await prisma.lessonWatched.update({ where: { id: exists.id }, data: { watchedTime: watchedTime.toString() } })
            return data
        }

        const data = await prisma.lessonWatched.create({ data: { watchedTime: watchedTime.toString(), lesson_id, user_id: this.id } })
        return data
    }
}
