import { Crown, Edit, Trash2, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getInitials } from "@/lib/utils"
import type { User } from "@/types"
import { isAdminRole, ROLE_LABELS } from "../roles"

interface MemberCardProps {
    member: User
    isCurrentUser: boolean
    onEdit: () => void
    onDelete: () => void
}

export function MemberCard({
    member,
    isCurrentUser,
    onEdit,
    onDelete,
}: MemberCardProps) {
    const isAdmin = isAdminRole(member.role)
    const RoleIcon = isAdmin ? Crown : UserIcon

    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="bg-zinc-950 text-white">
                            {getInitials(member.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold">
                            {member.name}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                            {member.email}
                        </p>
                        {(member.role || isCurrentUser) && (
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                {member.role && (
                                    <span
                                        className={
                                            isAdmin
                                                ? "inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700"
                                                : "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                                        }
                                    >
                                        <RoleIcon className="h-3 w-3" />
                                        {ROLE_LABELS[member.role]}
                                    </span>
                                )}
                                {isCurrentUser && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                        Você
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onEdit}
                            aria-label={`Editar ${member.name}`}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onDelete}
                            disabled={isCurrentUser}
                            aria-label={`Remover ${member.name}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
