import { Server as SocketIoServer } from "socket.io"
import { Server as HttpServer } from "http"
import { Server as HttpsServer } from "https"
import { Socket } from "socket.io"
import google from "../google"
import { SignupForm } from "../types/user/signup"
import { User, UserPrisma } from "../class/User"
import { LoginForm } from "../types/user/login"

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

    socket.on("disconnect", async (reason) => {
        console.log(`disconnected: ${socket.id}`)
    })

    socket.on("google:login", (data) => google.login.login(socket, data))
    socket.on("google:exchange", (data) => google.login.exchangeCode(socket, data))
    socket.on("google:link", (user) => google.person.link(socket, user))

    socket.on("user:signup", (data: SignupForm) => User.signup(socket, data))
    socket.on("user:list", async () => await User.list(socket))
    socket.on("user:login", (data: LoginForm) => User.login(socket, data))
    socket.on("user:update", async (data: Partial<UserPrisma> & { id: number }) => await User.update(data, socket))
}

export default { initializeIoServer, getIoInstance, handleSocket }
