import { Post, Prisma } from "@prisma/client";
import { Context } from "../index";

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

export const Mutation = {
    postCreate: async (
            parent: any, 
            { post }: PostArgs, 
            { prisma }: Context
        ): Promise<PostPayloadType> => {
            const { title, content } = post 
            if (!title || !content){
                return  {
                    userErrors: [{
                        message: "Title and Content are mandatory fields for creating a Post"
                    }],
                    post: null
                }
            }

            return {
                userErrors: [],
                post: prisma.post.create({
                    data: {
                        title: title,
                        content: content,
                        authorId: 1
                    }
                })
            }
            
    },

    postUpdate:async (
        parent:any, 
        { postId, post }: {postId: string, post: PostArgs["post"]}, 
        { prisma }: Context
        ): Promise<PostPayloadType> => {
            const { title, content } = post;

            if(!title && !content){
                return {
                    userErrors: [{
                        message: "At least one field to update is required (Title or Content)"
                    }],
                    post: null
                }
            }
            
            const existingPost = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            })

            let payloadToUpdate = {
                title,
                content
            }

            if(!title) delete payloadToUpdate.title;
            if(!content) delete payloadToUpdate.content

            if(!existingPost){
                return {
                    userErrors: [{
                        message: "Post does not exist"
                    }],
                    post: null
                }
            }

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
        { prisma } : Context
        ): Promise<PostPayloadType> => {
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });

            if(!post){
                return {
                    userErrors: [{
                        message: "Post does not exist"
                    }],
                    post: null
                };
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
        }
};