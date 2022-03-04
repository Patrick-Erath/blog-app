import { Context } from "../index";
import { postErrorMessage } from "./errors";

interface CanUserMutatePostParams {
    userId: number,
    postId: number,
    prisma: Context['prisma']
}

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma
}: CanUserMutatePostParams) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!user){
        return postErrorMessage("User not found");
    };

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if(post?.authorId !== user.id){
        return postErrorMessage("This Post does not belong to the currently logged-in user");
    }
}