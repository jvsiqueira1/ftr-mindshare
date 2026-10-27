import { MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeDate, getInitials } from "@/lib/utils"
import type { Idea } from "@/types"

interface IdeaCardProps {
    idea: Idea
    onClick: () => void
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
    return (
        <Card className="relative transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-ring">
            <CardHeader>
                <CardTitle className="line-clamp-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-zinc-950 text-sm text-primary-foreground">
                                {getInitials(idea.author?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="line-clamp-1 text-sm font-medium">
                            {idea.author?.name ?? "Usuário"}
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <button
                    type="button"
                    onClick={onClick}
                    className="line-clamp-2 text-left text-xl text-zinc-950 outline-none transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                    {idea.title}
                </button>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {idea.description}
                </p>
                <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-1 text-sm text-muted-foreground"
                            title="Comentários"
                        >
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span>{idea.comments?.length ?? 0}</span>
                        </div>
                        <div
                            className="flex items-center gap-3 rounded-md border border-zinc-200 px-3 py-1 text-sm text-muted-foreground"
                            title="Votos"
                        >
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            <span>{idea.countVotes ?? 0}</span>
                        </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {formatRelativeDate(idea.createdAt)}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
