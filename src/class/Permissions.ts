import { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { WithoutFunctions } from "./helpers"

export type PermissionsPrisma = Prisma.PermissionsGetPayload<{}>
export type PermissionsForm = Omit<WithoutFunctions<Permissions>, "id">
export type PartialPermissions = Partial<Permissions> & { id: string }

export class Permissions {
    id: number
    role_id: number | null
    panelTab: boolean
    creatorTab: boolean
    searchTab: boolean
    favoritesTab: boolean
    configTab: boolean

    static async createDefault() {
        const data = await prisma.permissions.create({
            data: {
                configTab: true,
                creatorTab: true,
                favoritesTab: true,
                panelTab: true,
                searchTab: true,
            },
        })

        const permissions = new Permissions(data)
        return permissions
    }

    constructor(data: PermissionsPrisma) {
        this.id = data.id
        this.configTab = data.configTab
        this.creatorTab = data.creatorTab
        this.favoritesTab = data.favoritesTab
        this.panelTab = data.panelTab
        this.role_id = data.role_id
        this.searchTab = data.searchTab
    }
}
