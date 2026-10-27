import { useMutation } from "@apollo/client/react"
import { type SubmitEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CREATE_IDEA } from "@/lib/graphql/mutations/Idea"
import { LIST_IDEAS } from "@/lib/graphql/queries/Idea"
import { getErrorMessage } from "@/lib/utils"
import type { CreateIdeaInput } from "@/types"

interface CreateIdeaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateIdeaDialog({
    open,
    onOpenChange,
}: CreateIdeaDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const [createIdea, { loading }] = useMutation<
        unknown,
        { data: CreateIdeaInput }
    >(CREATE_IDEA, {
        refetchQueries: [LIST_IDEAS],
    })

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setTitle("")
            setDescription("")
        }
        onOpenChange(nextOpen)
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await createIdea({
                variables: {
                    data: {
                        title: title.trim(),
                        description: description.trim() || undefined,
                    },
                },
            })
            toast.success("Ideia criada com sucesso")
            handleOpenChange(false)
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao criar a ideia"))
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-2xl font-bold leading-tight">
                        Compartilhe sua ideia
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Adicione uma nova ideia para seu time
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-normal">
                            Título
                        </Label>
                        <Input
                            id="title"
                            placeholder="Dê um nome para a sua ideia"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label
                            htmlFor="description"
                            className="text-sm font-normal"
                        >
                            Descrição
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva a sua ideia"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="resize-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
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
                            disabled={loading || !title.trim()}
                        >
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
