import { useQuery } from "@apollo/client/react"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LIST_MEMBERS } from "@/lib/graphql/queries/Members"
import { useAuthStore } from "@/stores/auth"
import type { User } from "@/types"
import { DeleteMemberDialog } from "./components/DeleteMemberDialog"
import { EditMemberDialog } from "./components/EditMemberDialog"
import { InviteMemberDialog } from "./components/InviteMemberDialog"
import { MemberCard } from "./components/MemberCard"

export function Members() {
    const [searchQuery, setSearchQuery] = useState("")
    const [openInviteDialog, setOpenInviteDialog] = useState(false)
    const [openEditMemberDialog, setOpenEditMemberDialog] = useState(false)
    const [openDeleteMemberDialog, setOpenDeleteMemberDialog] = useState(false)
    const [member, setMember] = useState<User | null>(null)

    const currentUserId = useAuthStore((state) => state.user?.id)
    const { data, loading, error } = useQuery<{ listUsers: User[] }>(
        LIST_MEMBERS,
    )

    const handleEditUser = (editMember: User) => {
        setMember(editMember)
        setOpenEditMemberDialog(true)
    }

    const handleDeleteUser = (deleteMember: User) => {
        setMember(deleteMember)
        setOpenDeleteMemberDialog(true)
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()
    const members = (data?.listUsers ?? []).filter(
        ({ name, email }) =>
            name.toLowerCase().includes(normalizedQuery) ||
            email.toLowerCase().includes(normalizedQuery),
    )

    return (
        <Page>
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-medium text-purple-600">
                            Usuários
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie os membros e suas permissões
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Label
                            htmlFor="search"
                            className="whitespace-nowrap text-sm"
                        >
                            Busque membros:
                        </Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="search"
                                type="search"
                                placeholder="Nome ou e-mail"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-50 pl-9"
                            />
                        </div>
                        <Button onClick={() => setOpenInviteDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo usuário
                        </Button>
                    </div>
                </div>

                {loading && !data && (
                    <p className="text-muted-foreground">
                        Carregando membros...
                    </p>
                )}

                {error && (
                    <p className="text-destructive">
                        Não foi possível carregar os membros.
                    </p>
                )}

                {!loading && !error && members.length === 0 && (
                    <p className="text-muted-foreground">
                        {normalizedQuery
                            ? "Nenhum membro encontrado para essa busca."
                            : "Nenhum membro cadastrado."}
                    </p>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {members.map((item) => (
                        <MemberCard
                            key={item.id}
                            member={item}
                            isCurrentUser={item.id === currentUserId}
                            onEdit={() => handleEditUser(item)}
                            onDelete={() => handleDeleteUser(item)}
                        />
                    ))}
                </div>
            </div>

            <InviteMemberDialog
                open={openInviteDialog}
                onOpenChange={setOpenInviteDialog}
            />

            <EditMemberDialog
                key={member?.id}
                open={openEditMemberDialog}
                onOpenChange={setOpenEditMemberDialog}
                member={member}
            />

            <DeleteMemberDialog
                open={openDeleteMemberDialog}
                onOpenChange={setOpenDeleteMemberDialog}
                member={member}
            />
        </Page>
    )
}
