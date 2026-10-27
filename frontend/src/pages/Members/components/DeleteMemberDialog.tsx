import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DELETE_USER } from "@/lib/graphql/mutations/Members"
import { LIST_MEMBERS } from "@/lib/graphql/queries/Members"
import { getErrorMessage } from "@/lib/utils"
import type { User } from "@/types"

interface DeleteMemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    member: User | null
}

export function DeleteMemberDialog({
    open,
    onOpenChange,
    member,
}: DeleteMemberDialogProps) {
    const [deleteUserMutation, { loading }] = useMutation<
        { deleteUser: boolean },
        { id: string }
    >(DELETE_USER, {
        refetchQueries: [LIST_MEMBERS],
    })

    const handleDeleteUser = async () => {
        if (!member) return

        try {
            await deleteUserMutation({
                variables: { id: member.id },
            })
            toast.success("Usuário removido com sucesso")
            onOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao remover o usuário"))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remover usuário</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja remover{" "}
                        <span className="font-medium text-foreground">
                            {member?.name}
                        </span>
                        ? Essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteUser}
                        disabled={loading}
                    >
                        {loading ? "Removendo..." : "Remover"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
