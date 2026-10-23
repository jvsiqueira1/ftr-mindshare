import { Arg, FieldResolver, Mutation, Resolver, Root } from "type-graphql"
import type { User } from "@/generated/prisma/client"
import { GqlUser } from "@/graphql/decorators/user.decorator"
import { IdeaModel } from "@/models/idea.model"
import { UserModel } from "@/models/user.model"
import { VoteModel } from "@/models/vote.model"
import { IdeaService } from "@/services/idea.service"
import { UserService } from "@/services/user.service"
import { VoteService } from "@/services/vote.service"

@Resolver(() => VoteModel)
export class VoteResolver {
    private readonly voteService = new VoteService()
    private readonly ideaService = new IdeaService()
    private readonly userService = new UserService()

    @Mutation(() => Boolean)
    async toggleVote(
        @Arg("ideaId", () => String) ideaId: string,
        @GqlUser() user: User,
    ): Promise<boolean> {
        return this.voteService.toggleVote(user.id, ideaId)
    }

    @FieldResolver(() => IdeaModel)
    async idea(@Root() vote: VoteModel): Promise<IdeaModel> {
        return this.ideaService.findIdeaById(vote.ideaId)
    }

    @FieldResolver(() => UserModel)
    async user(@Root() vote: VoteModel): Promise<UserModel> {
        return this.userService.findUser(vote.userId)
    }
}
