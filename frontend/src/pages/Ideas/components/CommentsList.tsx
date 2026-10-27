import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatRelativeDate, getInitials } from "@/lib/utils"
import type { Comment } from "@/types"

interface CommentsListProps {
    comments: Comment[]
    loading: boolean
}

export function CommentsList({ comments, loading }: CommentsListProps) {
    if (loading) {
        return (
            <p className="text-muted-foreground">Carregando comentários...</p>
        )
    }

    if (comments.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
        )
    }

    return (
        <ul className="space-y-8 p-2">
            {comments.map((comment) => (
                <li key={comment.id} className="flex items-start gap-4">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-blue-600 text-white">
                            {getInitials(comment.author?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-4">
                            <p className="text-base font-semibold">
                                {comment.author?.name ?? "Usuário"}
                            </p>
                            <span className="shrink-0 text-xs text-muted-foreground">
                                {formatRelativeDate(comment.createdAt)}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}
