import Expo from "expo-server-sdk"
import { PushNotification } from "../types/PushNotification"

const expo = new Expo({
    useFcmV1: true,
})

const sendPushNotifications = async (messages: PushNotification[]) => {
    const chunks = expo.chunkPushNotifications(messages)
    try {
        const tickets = await Promise.all(
            chunks.map(async (chunk) => {
                try {
                    return await expo.sendPushNotificationsAsync(chunk)
                } catch (error) {
                    console.log(error)
                }
            })
        )

        console.log(tickets)
        return tickets
    } catch (error) {
        console.log("error 2")
        console.log(error)
    }
}

export default { sendPushNotifications }
