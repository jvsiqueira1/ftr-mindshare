import type { CreateIdeaInput, UpdateIdeaInput } from "@/dtos/input/idea.input"
import { prismaClient } from "@/lib/prisma"

export class IdeaService {
    async createIdea(data: CreateIdeaInput, authorId: string) {
        return prismaClient.idea.create({
            data: {
                title: data.title,
                description: data.description,
                authorId: authorId,
            },
        })
    }

    async updateIdea(id: string, data: UpdateIdeaInput) {
        const idea = await prismaClient.idea.findUnique({
            where: { id },
        })

        if (!idea) throw new Error("Ideia não encontrada")

        return prismaClient.idea.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
            },
        })
    }

    async findIdeaById(id: string) {
        const idea = await prismaClient.idea.findUnique({
            where: { id },
        })

        if (!idea) throw new Error("Ideia não encontrada")

        return idea
    }

    async listIdeas() {
        return prismaClient.idea.findMany()
    }

    async deleteIdea(id: string) {
        console.log(id)
        const findIdea = await prismaClient.idea.findUnique({
            where: { id },
        })

        console.log(findIdea)

        if (!findIdea) throw new Error("Ideia não encontrada")

        return prismaClient.idea.delete({
            where: { id },
        })
    }
}
