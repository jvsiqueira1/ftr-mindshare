import { useMutation } from "@apollo/client/react"
import { type SubmitEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UPDATE_USER } from "@/lib/graphql/mutations/Members"
import { LIST_MEMBERS } from "@/lib/graphql/queries/Members"
import { getErrorMessage } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import type { Role, UpdateUserInput, User } from "@/types"
import { ROLE_OPTIONS } from "../roles"

interface EditMemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    member: User | null
}

type UpdateUserMutationData = { updateUser: User }

type UpdateUserVariables = {
    id: string
    data: UpdateUserInput
}

export function EditMemberDialog({
    open,
    onOpenChange,
    member,
}: EditMemberDialogProps) {
    const [name, setName] = useState(member?.name ?? "")
    const [role, setRole] = useState<Role>(member?.role ?? "member")

    const currentUser = useAuthStore((state) => state.user)
    const setUser = useAuthStore((state) => state.setUser)

    const [updateUserMutation, { loading }] = useMutation<
        UpdateUserMutationData,
        UpdateUserVariables
    >(UPDATE_USER, {
        refetchQueries: [LIST_MEMBERS],
    })

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setName(member?.name ?? "")
            setRole(member?.role ?? "member")
        }
        onOpenChange(nextOpen)
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!member) return

        try {
            const { data } = await updateUserMutation({
                variables: {
                    id: member.id,
                    data: { name: name.trim(), role },
                },
            })

            if (data?.updateUser && currentUser?.id === data.updateUser.id) {
                setUser({ ...currentUser, ...data.updateUser })
            }

            toast.success("Usuário atualizado com sucesso")
            onOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao atualizar o usuário"))
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar usuário</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome</Label>
                            <Input
                                id="edit-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Papel</Label>
                            <select
                                id="edit-role"
                                className="h-10 w-full rounded-md border bg-background px-3"
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value as Role)
                                }
                                disabled={loading}
                            >
                                {ROLE_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">E-mail</Label>
                            <Input
                                id="edit-email"
                                value={member?.email ?? ""}
                                disabled
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !name.trim()}
                        >
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
