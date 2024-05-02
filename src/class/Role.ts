import { Prisma } from "@prisma/client"
import { Socket } from "socket.io"
import { prisma } from "../prisma"
import { Permissions } from "./Permissions"

export const role_include = Prisma.validator<Prisma.RoleInclude>()({ permissions: true })
export type RolePrisma = Prisma.RoleGetPayload<{ include: typeof role_include }>

export class Role {
    id: number
    name: string
    permissions: Permissions

    constructor(data: RolePrisma) {
        this.load(data)
    }

    static async list() {
        const data = await prisma.role.findMany({ include: role_include })
        const roles = data.map((item) => new Role(item))
        return roles
    }

    static async existsDefault() {
        const default_role = await prisma.role.findUnique({ where: { id: 1 }, include: role_include })
        return !!default_role
    }

    static async createDefault(socket?: Socket) {
        try {
            const permissions = await Permissions.createDefault()

            const role = await prisma.role.create({
                data: {
                    id: 1,
                    name: "padrão",
                    permissions_id: permissions.id,
                },
                include: role_include,
            })

            socket?.emit("role:createdefault", new Role(role))
        } catch (error) {
            console.log(error)
            socket?.emit("role:createdefault:error", error?.toString())
        }
    }

    load(data: RolePrisma) {
        this.id = data.id
        this.name = data.name
        this.permissions = new Permissions(data.permissions)
    }

    async update(data: Partial<Role>) {
        try {
            const updated = await prisma.role.update({
                where: { id: this.id },
                data: {
                    ...data,
                    id: undefined,
                    permissions: data.permissions ? { update: { ...data.permissions } } : undefined,
                },
                include: role_include,
            })

            this.load(updated)
        } catch (error) {
            console.log(error)
        }
    }
}
