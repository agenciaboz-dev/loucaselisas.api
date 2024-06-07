import { Prisma } from "@prisma/client"
import { WithoutFunctions } from "./helpers"
import { PushNotification } from "../types/PushNotification"
import Expo from "expo-server-sdk"
import { prisma } from "../prisma"
import { uid } from "uid"

export type NotificationPrisma = Prisma.NotificationGetPayload<{}>
export type NotificationForm = Omit<WithoutFunctions<Notification>, "id" | "viewed" | "datetime" | "status" | "expoPushToken"> & {
    expoPushToken?: string[] | null
}

const expo = new Expo({
    useFcmV1: true,
})

export class Notification {
    id: string
    status: string
    viewed: boolean
    body: string
    datetime: string
    target_route: string
    target_param: any
    user_id: string
    expoPushToken: string[]
    image: string
    title: string

    static async findById(id: string) {
        const data = await prisma.notification.findUnique({ where: { id } })
        if (!data) throw "notificação não encontrada"

        const notification = new Notification(data)
        return notification
    }

    static async new(forms: NotificationForm[]) {
        const notifications = (
            await Promise.all(
                forms.map(
                    async (item) =>
                        await prisma.notification.create({
                            data: {
                                id: uid(),
                                body: item.body,
                                datetime: new Date().getTime().toString(),
                                status: "pending",
                                target_param: JSON.stringify(item.target_param),
                                target_route: item.target_route,
                                user_id: item.user_id,
                                expoPushToken: JSON.stringify(item.expoPushToken),
                                image: item.image,
                                title: item.title,
                            },
                        })
                )
            )
        ).map((item) => new Notification(item))

        console.log(notifications)

        const splitted_forms = notifications
            .filter((item) => !!item.expoPushToken)
            .map((notification) => {
                const tokens = notification.expoPushToken.map((token) => ({
                    sound: "default",
                    body: notification.body,
                    to: token,
                    data: { id: notification.id, target_route: notification.target_route, target_param: notification.target_param },
                }))
                return tokens
            })
            .flatMap((item) => item)

        const chunks = expo.chunkPushNotifications(splitted_forms as PushNotification[])
        const tickets_chunks = await Promise.all(
            chunks.map(async (chunk) => {
                try {
                    const ticket = await expo.sendPushNotificationsAsync(chunk)
                    return ticket
                } catch (error) {
                    console.log(error)
                }
            })
        )

        console.log(tickets_chunks)

        return tickets_chunks
    }

    constructor(data: NotificationPrisma) {
        this.id = data.id
        this.status = data.status
        this.viewed = data.viewed
        this.body = data.body
        this.datetime = data.datetime
        this.target_param = JSON.parse(data.target_param)
        this.target_route = data.target_route
        this.user_id = data.user_id
        this.expoPushToken = JSON.parse(data.expoPushToken)
        this.image = data.image
        this.title = data.title
    }
}
