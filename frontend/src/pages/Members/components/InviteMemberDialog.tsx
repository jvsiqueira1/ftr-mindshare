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
import { CREATE_USER } from "@/lib/graphql/mutations/Members"
import { LIST_MEMBERS } from "@/lib/graphql/queries/Members"
import { getErrorMessage } from "@/lib/utils"
import type { CreateUserInput } from "@/types"

interface InviteMemberDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({
    open,
    onOpenChange,
}: InviteMemberDialogProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const [createUserMutation, { loading }] = useMutation<
        unknown,
        { data: CreateUserInput }
    >(CREATE_USER, {
        refetchQueries: [LIST_MEMBERS],
    })

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setName("")
            setEmail("")
        }
        onOpenChange(nextOpen)
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await createUserMutation({
                variables: {
                    data: { name: name.trim(), email: email.trim() },
                },
            })
            toast.success("Usuário convidado com sucesso")
            handleOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao convidar o usuário"))
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Convidar usuário</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite-name">Nome</Label>
                            <Input
                                id="invite-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome do usuário"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invite-email">E-mail</Label>
                            <Input
                                id="invite-email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@exemplo.com"
                                disabled={loading}
                                required
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
                        <Button type="submit" disabled={loading}>
                            {loading ? "Convidando..." : "Convidar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
