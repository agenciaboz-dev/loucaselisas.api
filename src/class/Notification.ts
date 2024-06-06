import { Prisma } from "@prisma/client"
import { WithoutFunctions } from "./helpers"
import { PushNotification } from "../types/PushNotification"
import Expo from "expo-server-sdk"
import { prisma } from "../prisma"
import { uid } from "uid"
import { getIoInstance } from "../io/io"

export type NotificationPrisma = Prisma.NotificationGetPayload<{}>
export type NotificationForm = Omit<WithoutFunctions<Notification>, "id" | "viewed" | "datetime" | "status" | "expoPushToken"> & {
    expoPushToken?: string | null
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
    expoPushToken: string

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
                                expoPushToken: item.expoPushToken || "",
                            },
                        })
                )
            )
        ).map((item) => new Notification(item))

        console.log(notifications)

        const expo_forms: PushNotification[] = notifications
            .filter((item) => !!item.expoPushToken)
            .map((item) => ({
                sound: "default",
                body: item.body,
                to: item.expoPushToken,
                data: { target_route: item.target_route, target_param: item.target_param },
            }))

        const chunks = expo.chunkPushNotifications(expo_forms)
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

        const io = getIoInstance()
        notifications.forEach((notification) => {
            io.emit("user:notification", notification.user_id, notification)
        })

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
        this.expoPushToken = data.expoPushToken
    }
}