import { ThumbsUp } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn, getInitials } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import type { Idea } from "@/types"

interface CommentAreaProps {
    idea?: Idea
    onAddComment: (content: string) => Promise<boolean>
    onVote: () => void
    commenting: boolean
    voting: boolean
}

export function CommentArea({
    idea,
    onAddComment,
    onVote,
    commenting,
    voting,
}: CommentAreaProps) {
    const [content, setContent] = useState("")
    const user = useAuthStore((state) => state.user)

    const hasVoted = idea?.votes?.some((vote) => vote.userId === user?.id)

    const handleAddComment = async () => {
        const trimmed = content.trim()
        if (!trimmed) return

        const created = await onAddComment(trimmed)
        if (created) setContent("")
    }

    return (
        <div className="shrink-0 border-t p-6">
            <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials(user?.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                    <Textarea
                        placeholder="Digite um comentário"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                handleAddComment()
                            }
                        }}
                        rows={3}
                        className="resize-none"
                        disabled={!idea || commenting}
                    />
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={onVote}
                            disabled={!idea || voting}
                            aria-pressed={hasVoted}
                            className={cn(
                                "hover:bg-green-100",
                                hasVoted
                                    ? "border-green-600 bg-green-100 text-green-800"
                                    : "border-green-500 bg-green-50 text-green-700",
                            )}
                        >
                            <ThumbsUp
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    hasVoted && "fill-current",
                                )}
                            />
                            {idea?.countVotes ?? 0}
                        </Button>
                        <Button
                            onClick={handleAddComment}
                            disabled={!content.trim() || commenting}
                            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {commenting ? "Enviando..." : "Comentar"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
