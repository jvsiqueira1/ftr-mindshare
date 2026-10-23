import type { User } from "@prisma/client"
import {
    Arg,
    FieldResolver,
    Mutation,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql"
import { CreateCommentInput } from "@/dtos/input/comment.input"
import { GqlUser } from "@/graphql/decorators/user.decorator"
import { IsAuth } from "@/middlewares/auth.middleware"
import { CommentModel } from "@/models/comment.model"
import { IdeaModel } from "@/models/idea.model"
import { CommentService } from "@/services/comment.service"
import { IdeaService } from "@/services/idea.service"

@Resolver(() => CommentModel)
@UseMiddleware(IsAuth)
export class CommentResolver {
    private readonly commentService = new CommentService()
    private readonly ideaService = new IdeaService()

    @Mutation(() => CommentModel)
    async createComment(
        @Arg("ideaId", () => String) ideaId: string,
        @Arg("data", () => CreateCommentInput) data: CreateCommentInput,
        @GqlUser() user: User,
    ): Promise<CommentModel> {
        return this.commentService.create(ideaId, user.id, data)
    }

    @FieldResolver(() => IdeaModel)
    async idea(@Root() comment: CommentModel): Promise<IdeaModel> {
        return this.ideaService.findIdeaById(comment.ideaId)
    }
}
