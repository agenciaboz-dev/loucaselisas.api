import { Prisma } from "@prisma/client"

export type ProfilePermissionsPrisma = Prisma.ProfilePermissionsGetPayload<{}>
export type AdminPermissionsPrisma = Prisma.AdminPermissionsGetPayload<{}>
export type GeneralPermissionsPrisma = Prisma.GeneralPermissionsGetPayload<{}>

export class Permissions {
    id: string

    constructor({ id }: { id: string }) {
        this.id = id
    }
}

export class ProfilePermissions extends Permissions {
    viewMembers: boolean
    privacyProfile: boolean
    viewPrivacyProfile: boolean
    indexProfile: boolean

    constructor(data: ProfilePermissionsPrisma) {
        super(data)
        this.indexProfile = data.indexProfile
        this.privacyProfile = data.privacyProfile
        this.viewMembers = data.viewMembers
        this.viewPrivacyProfile = data.viewPrivacyProfile
    }
}

export class AdminPermissions extends Permissions {
    panelAdm: boolean
    panelCreator: boolean
    createChats: boolean
    deleteComments: boolean
    panelStatistics: boolean
    updateUsers: boolean
    deleteUsers: boolean

    constructor(data: AdminPermissionsPrisma) {
        super(data)
        this.panelAdm = data.panelAdm
        this.createChats = data.createChats
        this.deleteUsers = data.deleteUsers
        this.deleteComments = data.deleteComments
        this.panelCreator = data.panelCreator
        this.panelStatistics = data.panelStatistics
        this.updateUsers = data.updateUsers
    }
}

export class GeneralPermissions extends Permissions {
    editProfile: boolean
    deleteProfile: boolean

    constructor(data: GeneralPermissionsPrisma) {
        super(data)
        this.deleteProfile = data.deleteProfile
        this.editProfile = data.editProfile
    }
}
