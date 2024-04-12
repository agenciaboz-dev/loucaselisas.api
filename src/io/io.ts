import { Server as SocketIoServer } from "socket.io"
import { Server as HttpServer } from "http"
import { Server as HttpsServer } from "https"
import { Socket } from "socket.io"
import google from "../google"
import { LoginForm } from "../types/shared/login"
import { Creator, CreatorForm, User, UserForm, UserPrisma } from "../class"
import { Role } from "../class/Role"
import { Course, CourseForm } from "../class/Course"
import { UserImageForm } from "../class/User"

let io: SocketIoServer | null = null

export const initializeIoServer = (server: HttpServer | HttpsServer) => {
    io = new SocketIoServer(server, { cors: { origin: "*" }, maxHttpBufferSize: 1e8 })
    return io
}

export const getIoInstance = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized. Please call initializeIoServer first.")
    }
    return io
}

export const handleSocket = (socket: Socket) => {
    console.log(`new connection: ${socket.id}`)

    socket.on("disconnect", (reason) => {
        console.log(`disconnected: ${socket.id}`)
    })

    socket.on("google:login", (data) => google.login.login(socket, data))
    socket.on("google:exchange", (data) => google.login.exchangeCode(socket, data))
    socket.on("google:link", (user) => google.person.link(socket, user))

    socket.on("user:signup", (data: UserForm) => User.signup(socket, data))
    socket.on("user:list", () => User.list(socket))
    socket.on("user:login", (data: LoginForm) => User.login(data, socket))
    socket.on("user:update", (data: Partial<UserPrisma> & { id: string }) => User.update(data, socket))
    socket.on("user:image:update", (data: UserImageForm) => User.updateImage(data, socket))

    socket.on("creator:list", () => Creator.list(socket))
    socket.on("creator:signup", (data: CreatorForm) => Creator.new(socket, data))
    socket.on("creator:delete", (id: string) => Creator.delete(socket, id))

    socket.on("role:createdefault", () => Role.createDefault(socket))

    socket.on("course:new", (data: CourseForm) => Course.new(socket, data))
}

export default { initializeIoServer, getIoInstance, handleSocket }
