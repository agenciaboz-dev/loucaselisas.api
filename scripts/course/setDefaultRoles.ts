import { prisma } from "../../src/prisma"

const setDefaultRoles = async () => {
    const courses = await prisma.course.findMany()
    courses.forEach(async (item) => {
        const course_identifier = `${item.id} - ${item.name}`
        try {
            await prisma.course.update({
                where: { id: item.id },
                data: {
                    roles: { connect: { id: 1 } },
                },
            })
            console.log(`updated course ${course_identifier}`)
        } catch (error) {
            console.log(`failed to update course ${course_identifier}`)
        }
    })
}

setDefaultRoles()
