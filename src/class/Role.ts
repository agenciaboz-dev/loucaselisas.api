import { Prisma } from "@prisma/client"
import { AdminPermissions, GeneralPermissions, ProfilePermissions } from "./Permissions"
import { Socket } from "socket.io"
import { prisma } from "../prisma"
import { uid } from "uid"

export const role_include = Prisma.validator<Prisma.RoleInclude>()({ admin_permissions: true, general_permissions: true, profile_permissions: true })
export type RolePrisma = Prisma.RoleGetPayload<{ include: typeof role_include }>

export class Role {
    id: number
    name: string
    profile_permissions: ProfilePermissions
    admin_permissions: AdminPermissions
    general_permissions: GeneralPermissions

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
            const admin = await prisma.adminPermissions.create({ data: { id: uid() } })
            const general = await prisma.generalPermissions.create({ data: { id: uid() } })
            const profile = await prisma.profilePermissions.create({ data: { id: uid() } })
            const role = await prisma.role.create({
                data: {
                    id: 1,
                    name: "padrão",
                    admin_permissions_id: admin.id,
                    general_permissions_id: general.id,
                    profile_permissions_id: profile.id,
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
        this.admin_permissions = new AdminPermissions(data.admin_permissions)
        this.general_permissions = new GeneralPermissions(data.general_permissions)
        this.profile_permissions = new ProfilePermissions(data.profile_permissions)
    }

    async update(data: Partial<Role>) {
        try {
            const updated = await prisma.role.update({
                where: { id: this.id },
                data: {
                    ...data,
                    id: undefined,
                    admin_permissions: data.admin_permissions ? { update: { ...data.admin_permissions } } : {},
                    profile_permissions: data.profile_permissions ? { update: { ...data.profile_permissions } } : {},
                    general_permissions: data.general_permissions ? { update: { ...data.general_permissions } } : {},
                },
                include: role_include,
            })

            this.load(updated)
        } catch (error) {
            console.log(error)
        }
    }
}
