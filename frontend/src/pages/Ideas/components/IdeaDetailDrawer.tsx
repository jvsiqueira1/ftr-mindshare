import { skipToken, useMutation, useQuery } from "@apollo/client/react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { CREATE_COMMENT } from "@/lib/graphql/mutations/Comment"
import { TOGGLE_VOTE } from "@/lib/graphql/mutations/Vote"
import { GET_IDEA, LIST_IDEAS } from "@/lib/graphql/queries/Idea"
import { getErrorMessage } from "@/lib/utils"
import type { Idea } from "@/types"
import { CommentArea } from "./CommentArea"
import { CommentsList } from "./CommentsList"

interface IdeaDetailDrawerProps {
    ideaId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function IdeaDetailDrawer({
    open,
    onOpenChange,
    ideaId,
}: IdeaDetailDrawerProps) {
    const { data, loading } = useQuery<{ getIdea: Idea }>(
        GET_IDEA,
        ideaId ? { variables: { ideaId } } : skipToken,
    )

    const refetchQueries = [GET_IDEA, LIST_IDEAS]

    const [createComment, { loading: commenting }] = useMutation(
        CREATE_COMMENT,
        { refetchQueries, awaitRefetchQueries: true },
    )

    const [toggleVote, { loading: voting }] = useMutation(TOGGLE_VOTE, {
        refetchQueries,
        awaitRefetchQueries: true,
    })

    const idea = data?.getIdea

    const handleAddComment = async (content: string) => {
        if (!ideaId) return false

        try {
            await createComment({
                variables: { ideaId, data: { content } },
            })
            return true
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao enviar o comentário"))
            return false
        }
    }

    const handleVote = async () => {
        if (!ideaId) return

        try {
            await toggleVote({ variables: { ideaId } })
        } catch (error) {
            toast.error(getErrorMessage(error, "Falha ao registrar o voto"))
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="flex flex-col rounded-l-2xl">
                <div className="shrink-0 space-y-2 rounded-l-2xl bg-slate-100 p-6">
                    <div className="flex items-start justify-between">
                        <h2 className="flex-1 pr-4 text-2xl font-bold">
                            {idea?.title ?? "Carregando..."}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="shrink-0"
                            aria-label="Fechar"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    {idea?.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {idea.description}
                        </p>
                    )}
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto p-6">
                    <CommentsList
                        comments={idea?.comments ?? []}
                        loading={loading && !idea}
                    />
                </div>
                <CommentArea
                    key={ideaId}
                    idea={idea}
                    onAddComment={handleAddComment}
                    onVote={handleVote}
                    commenting={commenting}
                    voting={voting}
                />
            </DrawerContent>
        </Drawer>
    )
}
