import { useQuery } from "@apollo/client/react"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { LIST_IDEAS } from "@/lib/graphql/queries/Idea"
import type { Idea } from "@/types"
import { CreateIdeaDialog } from "./components/CreateIdeaDialog"
import { IdeaCard } from "./components/IdeaCard"
import { IdeaDetailDrawer } from "./components/IdeaDetailDrawer"

export function IdeasPage() {
    const [openDialog, setOpenDialog] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)
    const { data, loading, error } = useQuery<{ listIdeas: Idea[] }>(LIST_IDEAS)

    const ideas = data?.listIdeas ?? []

    const handleIdeaClick = (ideaId: string) => {
        setSelectedIdeaId(ideaId)
        setOpenDrawer(true)
    }

    return (
        <Page>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-medium text-purple-600">Ideias</h1>
                <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova ideia
                </Button>
            </div>

            {loading && !data && (
                <p className="pt-6 text-muted-foreground">
                    Carregando ideias...
                </p>
            )}

            {error && (
                <p className="pt-6 text-destructive">
                    Não foi possível carregar as ideias.
                </p>
            )}

            {!loading && !error && ideas.length === 0 && (
                <p className="pt-6 text-muted-foreground">
                    Nenhuma ideia cadastrada ainda. Que tal compartilhar a
                    primeira?
                </p>
            )}

            <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-4">
                {ideas.map((idea) => (
                    <IdeaCard
                        key={idea.id}
                        idea={idea}
                        onClick={() => handleIdeaClick(idea.id)}
                    />
                ))}
            </div>
            <IdeaDetailDrawer
                open={openDrawer}
                onOpenChange={setOpenDrawer}
                ideaId={selectedIdeaId}
            />
            <CreateIdeaDialog open={openDialog} onOpenChange={setOpenDialog} />
        </Page>
    )
}
