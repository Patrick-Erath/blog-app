import { Context } from "../index"

export const Query = {
    me: (parent: any, args:any, { userInfo, prisma }: Context) => {
        if(!userInfo) return null;

        return prisma.user.findUnique({
            where:{
                id: userInfo.userId
            }
        });
    },

    profile: (parent: any, { userId } : { userId: string}, { prisma }: Context) => {
        return prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        });
    },
    
    posts: (parent: any, args: any, { prisma }: Context) => {
        return prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    createdAt: "desc"
                },
            ],
        });
    },
};