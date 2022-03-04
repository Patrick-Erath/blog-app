import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils/canUserMutatePost";
import { postErrorMessage } from "../../utils/errors"

interface PostArgs {
    post: {
        title?: string 
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[]
    post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
    postCreate: async (
            parent: any, 
            { post }: PostArgs, 
            { prisma, userInfo }: Context
        ): Promise<PostPayloadType> => {
            
            if(!userInfo){
                return  postErrorMessage("You need to be logged in to create a Post");
            }
            
            const { title, content } = post 
            if (!title || !content){
                return  postErrorMessage("Title and Content are mandatory fields for creating a Post");
            }

            return {
                userErrors: [],
                post: prisma.post.create({
                    data: {
                        title: title,
                        content: content,
                        authorId: userInfo.userId
                    }
                })
            }
            
    },

    postUpdate:async (
        parent:any, 
        { postId, post }: {postId: string, post: PostArgs["post"]}, 
        { prisma, userInfo }: Context
        ): Promise<PostPayloadType> => {
            
            if(!userInfo){
                return  postErrorMessage("You need to be logged in to create a Post");
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma
            });

            if(error) return error;
            
            const { title, content } = post;
            if(!title && !content){
                return postErrorMessage("At least one field to update is required (Title or Content)");
            }
            
            const existingPost = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });

            if(!existingPost){
                return postErrorMessage("Post does not exist");
            }

            let payloadToUpdate = {
                title,
                content
            }
            if(!title) delete payloadToUpdate.title;
            if(!content) delete payloadToUpdate.content

            return {
                userErrors: [],
                post: prisma.post.update({
                    data: {
                        ...payloadToUpdate
                    },
                    where: {
                        id: Number(postId)
                    }
                })
            }
    },

    postDelete: async(
        parent:any,
        { postId }: { postId: string}, 
        { prisma, userInfo } : Context
        ): Promise<PostPayloadType> => {
            
            if(!userInfo){
                return  postErrorMessage("You need to be logged in to create a Post");
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma
            });
            if(error) return error;
            
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });

            if(!post){
                return postErrorMessage("Post does not exist");
            }

            await prisma.post.delete({
                where: {
                    id: Number(postId)
                }
            });

            return{
                userErrors: [],
                post: post
            }
    },

    postPublish: async(
        parent: any,
        { postId, published }: any,
        { prisma, userInfo }: Context
    ): Promise<PostPayloadType> => {
    
            if(!userInfo){
                return  postErrorMessage("You need to be logged in to create a Post");
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma
            });

            if(error) return error;

            return {
                userErrors: [],
                post: prisma.post.update({
                    data: {
                        published
                    },
                    where: {
                        id: Number(postId)
                    }
                })
        }
    }
};