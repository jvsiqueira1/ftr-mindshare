import type { User } from "@prisma/client"
import { createParameterDecorator, type ResolverData } from "type-graphql"
import type { GraphqlContext } from "@/graphql/context"
import { prismaClient } from "@/lib/prisma"

export const GqlUser = () => {
    return createParameterDecorator(
        async ({
            context,
        }: ResolverData<GraphqlContext>): Promise<User | null> => {
            if (!context?.user) return null

            try {
                const user = await prismaClient.user.findUnique({
                    where: { id: context.user },
                })

                if (!user) throw new Error("Usuário não encontrado")

                return user
            } catch (error) {
                console.error(error)
                return null
            }
        },
    )
}
