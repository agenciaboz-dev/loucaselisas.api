import { Creator, User, creator_include, user_include } from "../../src/class"
import { Course, course_include } from "../../src/class/Course"
import { Lesson, lesson_include } from "../../src/class/Course/Lesson"
import { Media } from "../../src/class/Gallery/Media"
import { prisma } from "../../src/prisma"

const updateMedia = async () => {
    console.log("updating medias")
    const data = await prisma.media.findMany()
    const medias = data.map((item) => new Media(item))
    const mediaLocalUrls = medias.filter((item) => !item.url.includes("https"))
    console.log(`${mediaLocalUrls.length} medias with local url`)

    mediaLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.url.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.media.update({ where: { id: item.id }, data: { url } })
            console.log(`updated media ${item.id} - ${item.url} to ${url}`)
        } catch (error) {
            console.log(`failed to update media ${item.id} - ${item.url}`)
        }
    })
}

const updateLessonThumb = async () => {
    console.log("updating lessons thumb")
    const data = await prisma.lesson.findMany({ include: lesson_include })
    const medias = data.map((item) => new Lesson("", item))
    const thumbLocalUrls = medias.filter((item) => item.thumb && !item.thumb.includes("https"))
    console.log(`${thumbLocalUrls.length} lesson thumbs with local url`)

    thumbLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.thumb!.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.lesson.update({ where: { id: item.id }, data: { thumb: url } })
            console.log(`updated lesson thumb ${item.id} - ${item.thumb} to ${url}`)
        } catch (error) {
            console.log(`failed to update lesson thumb ${item.id} - ${item.thumb}`)
        }
    })
}

const updateCourseCover = async () => {
    console.log("updating courses cover")
    const data = await prisma.course.findMany({ include: course_include })
    const medias = data.map((item) => new Course("", item))
    const coverLocalUrls = medias.filter((item) => item.cover && !item.cover.includes("https"))
    console.log(`${coverLocalUrls.length} course cover with local url`)

    coverLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.cover!.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.course.update({ where: { id: item.id }, data: { cover: url } })
            console.log(`updated course cover ${item.id} - ${item.cover} to ${url}`)
        } catch (error) {
            console.log(`failed to update course cover ${item.id} - ${item.cover}`)
        }
    })
}

const updateUserImages = async () => {
    console.log("updating users images")
    const data = await prisma.user.findMany({ include: user_include })
    const medias = data.map((item) => new User("", item))
    const profilePicLocalUrls = medias.filter((item) => item.image && !item.image.includes("https"))
    const coverLocalUrls = medias.filter((item) => item.cover && !item.cover.includes("https"))
    console.log(`${profilePicLocalUrls.length} user profile pic with local url`)
    console.log(`${coverLocalUrls.length} user cover with local url`)

    profilePicLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.image!.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.user.update({ where: { id: item.id }, data: { image: url } })
            console.log(`updated user image ${item.id} - ${item.image} to ${url}`)
        } catch (error) {
            console.log(`failed to update user image ${item.id} - ${item.image}`)
        }
    })

    coverLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.cover!.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.user.update({ where: { id: item.id }, data: { cover: url } })
            console.log(`updated user cover ${item.id} - ${item.cover} to ${url}`)
        } catch (error) {
            console.log(`failed to update user cover ${item.id} - ${item.cover}`)
        }
    })
}

const updateCreatorImages = async () => {
    console.log("updating creators images")
    const data = await prisma.creator.findMany({ include: creator_include })
    const medias = data.map((item) => new Creator("", item))
    const profilePicLocalUrls = medias.filter((item) => item.image && !item.image.includes("https"))
    const coverLocalUrls = medias.filter((item) => item.cover && !item.cover.includes("https"))
    console.log(`${profilePicLocalUrls.length} creator profile pic with local url`)
    console.log(`${coverLocalUrls.length} creator cover with local url`)

    profilePicLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.image!.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.creator.update({ where: { id: item.id }, data: { image: url } })
            console.log(`updated creator image ${item.id} - ${item.image} to ${url}`)
        } catch (error) {
            console.log(`failed to update creator image ${item.id} - ${item.image}`)
        }
    })

    coverLocalUrls.forEach(async (item) => {
        try {
            const endpoint = item.cover!.split("/static/")[1]
            const url = `https://app.agencyboz.com:4112/static/${endpoint}`
            await prisma.creator.update({ where: { id: item.id }, data: { cover: url } })
            console.log(`updated creator cover ${item.id} - ${item.cover} to ${url}`)
        } catch (error) {
            console.log(`failed to update creator cover ${item.id} - ${item.cover}`)
        }
    })
}

const setProdUrls = async () => {
    console.log("updating medias")
    await updateMedia()
    await updateLessonThumb()
    await updateCourseCover()
    await updateUserImages()
    await updateCreatorImages()
}

setProdUrls()
