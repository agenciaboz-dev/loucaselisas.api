import { Permissions } from "../../src/class/Permissions"
import { Role } from "../../src/class/Role"

const createDefaultPermissions = async () => {
    const permissions = await Permissions.createDefault()
}

createDefaultPermissions()
