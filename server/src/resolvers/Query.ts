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

    profile: async(parent: any, { userId } : { userId: string}, { userInfo, prisma }: Context) => {
        const isMyProfile = Number(userId) === userInfo?.userId;
        
        const profile = await prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        });

        if(!profile) null
        
        return {
            ...profile,
            isMyProfile
        }
        
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