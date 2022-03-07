import { Context } from "../index";
import { userLoader } from "../loaders/userLoaders";

interface PostParentType { 
    authorId: number
}

export const Post = {
    user: (parent: PostParentType, args:any, { userInfo, prisma }: Context) => {
        return userLoader.load(parent.authorId);
    },
} 