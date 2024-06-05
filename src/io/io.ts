import { Server as SocketIoServer } from "socket.io"
import { Server as HttpServer } from "http"
import { Server as HttpsServer } from "https"
import { Socket } from "socket.io"
import google from "../google"
import { LoginForm } from "../types/shared/login"
import { Creator, CreatorForm, User, UserForm, UserPrisma } from "../class"
import { Role } from "../class/Role"
import { Course, CourseForm } from "../class/Course"
import { PartialUser, UserImageForm } from "../class/User"
import { Chat } from "../class/Chat/Chat"
import { Message, MessageForm } from "../class/Chat/Message"

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

    socket.on("user:signup", (data: UserForm) => User.signup(data, socket))
    socket.on("user:list", () => User.list())
    socket.on("user:login", (data: LoginForm) => User.login(data, socket))
    socket.on("user:update", (data: PartialUser) => User.update(data, socket))
    socket.on("user:image:update", (data: UserImageForm) => User.updateImage(data, socket))

    socket.on("creator:list", () => Creator.list(socket))
    socket.on("creator:signup", (data: CreatorForm) => Creator.new(data, socket))
    socket.on("creator:delete", (id: string) => Creator.delete(id, socket))

    socket.on("role:createdefault", () => Role.createDefault(socket))

    socket.on("course:new", (data: CourseForm) => Course.new(data, socket))

    // ? chat handling
    socket.on("chat:join", (chat_id: string, platform: "app" | "admin") => Chat.join(socket, chat_id, platform))
    socket.on("chat:message", (data: MessageForm) => Message.new(data, socket))
    socket.on("chat:message:delete", (data: Message[], chat_id: string) => Chat.deleteMessages(socket, data, chat_id))
}

export default { initializeIoServer, getIoInstance, handleSocket }
