import { uid } from "uid"
import { prisma } from "../../src/prisma"

const setDefaultRoles = async () => {
    const courses = await prisma.course.findMany()
    courses.forEach(async (item) => {
        const course_identifier = `${item.id} - ${item.name}`
        try {
            await prisma.course.update({
                where: { id: item.id },
                data: {
                    chat: {
                        create: {
                            id: uid(),
                            media: {
                                create: {
                                    id: uid(),
                                    name: `Grupo de ${item.name}`,
                                },
                            },
                        },
                    },
                },
            })
            console.log(`created chat for course ${course_identifier}`)
        } catch (error) {
            console.log(`failed to create chat for course ${course_identifier}`)
        }
    })
}

setDefaultRoles()
