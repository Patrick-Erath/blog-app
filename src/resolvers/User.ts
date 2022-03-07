import { Context } from "../index"

interface UserParentType { 
    id: number
}

export const User = {
    posts: (parent: UserParentType, args:any, { userInfo, prisma }: Context) => {
        const isOwnProfile = parent.id === userInfo?.userId;

        console.log({
            "parent.id":parent.id,
            "userInfo.userId":userInfo?.userId
        })
        console.log(isOwnProfile)

        if(isOwnProfile){
            return prisma.post.findMany({
                where: {
                    authorId : parent.id,
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        }
        return prisma.post.findMany({
            where: {
                authorId : parent.id,
                published: true
            },
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        })
    },
} 