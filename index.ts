import express, { Express } from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./routes"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import https from "https"
import http from "http"
import fs from "fs"
import { handleSocket, initializeIoServer } from "./src/io/io"
import fileUpload from "express-fileupload"
import { setProd } from "./src/env"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.json({ limit: "10000mb" }))
app.use(bodyParser.urlencoded({ extended: false, limit: "10000mb" }))
app.use(cookieParser())
app.use(fileUpload())
app.use("/api", router)
app.use("/static", express.static("static"))

// whatsapp.client.initialize()

try {
    const server = https.createServer(
        {
            key: fs.readFileSync("/etc/letsencrypt/live/app.agencyboz.com/privkey.pem", "utf8"),
            cert: fs.readFileSync("/etc/letsencrypt/live/app.agencyboz.com/cert.pem", "utf8"),
            ca: fs.readFileSync("/etc/letsencrypt/live/app.agencyboz.com/fullchain.pem", "utf8"),
        },
        app
    )

    const io = initializeIoServer(server)

    io.on("connection", (socket) => {
        handleSocket(socket)
    })

    server.listen(port, () => {
        console.log(`[server]: Server is running at https://${port}`)
        setProd()
    })
} catch (e) {
    const server = http.createServer(app)

    const io = initializeIoServer(server)

    io.on("connection", (socket) => {
        handleSocket(socket)
    })

    server.listen(port, () => {
        console.log(`[server]: Server is running at http://${port}`)
    })
}
