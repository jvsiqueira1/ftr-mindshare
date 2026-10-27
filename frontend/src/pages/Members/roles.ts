import type { Role } from "@/types"

export const ROLE_LABELS: Record<Role, string> = {
    owner: "Owner",
    admin: "Admin",
    member: "Membro",
    viewer: "Leitor",
}

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(
    ([value, label]) => ({ value: value as Role, label }),
)

export function isAdminRole(role?: Role) {
    return role === "owner" || role === "admin"
}
