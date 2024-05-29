import getVideoDurationInSeconds from "get-video-duration"
import { prisma } from "../../src/prisma"

const setVideosDuration = async () => {
    const videos = await prisma.media.findMany({ where: { type: "video" } })
    videos.forEach(async (video) => {
        const duration = (await getVideoDurationInSeconds(video.url, "ffprobe")) * 1000
        const data = await prisma.media.update({ where: { id: video.id }, data: { duration: duration } })
        console.log(`updated video: ${video.id} with duration: ${duration}`)
    })
}

setVideosDuration()
