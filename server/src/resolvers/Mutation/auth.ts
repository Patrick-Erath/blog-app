import { Context } from "../../index";
import { userErrorMessage } from "../../utils/errors";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken"
import { JSON_SIGNATURE } from "../../keys";

interface SignupArgs {
    credentials: {
        email: string;
        password: string;
    };
    name: string;
    bio: string;
};

interface SigninArgs {
    credentials: {
        email: string;
        password: string;
    }
};

interface UserPayload {
    userErrors: {
        message: string
    }[];
    token: string | null;
};

export const authResolvers = {
    signup: async(
            parent: any, 
            { credentials, name, bio } : SignupArgs, 
            { prisma }: Context
        ): Promise<UserPayload> => {

            let validateInput = validateFields(credentials, name, bio);
            if(validateInput.userErrors.length > 0){
                return validateInput;
            }

            var existingUser = await prisma.user.findUnique({
                where:{
                    email: credentials.email
                }
            });

            if(existingUser){
                return userErrorMessage("User with this email already exists")
            }

            const hashedPasswod = await bcrypt.hash(credentials.password, 10);
            const user = await prisma.user.create({
                data: {
                    email: credentials.email,
                    name,
                    password: hashedPasswod
                }
            });
            await prisma.profile.create({
                data: {
                    bio,
                    userId: user.id
                }
            })
            
            return {
                userErrors:[{
                    message: ""
                }],
                token: JWT.sign(
                    {userId: user.id,}, 
                    JSON_SIGNATURE,
                    {expiresIn: 360000}
                )
            };
    },

    signin: async(
        parent: any, 
        { credentials } : SignupArgs, 
        { prisma }: Context
    ): Promise<UserPayload> => {
        const { email, password} = credentials;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return userErrorMessage("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return userErrorMessage("Invalid credentials");
        }

        return {
            userErrors:[{
                message: ""
            }],
            token: JWT.sign(
                {userId: user.id,}, 
                JSON_SIGNATURE,
                {expiresIn: 360000}
            )
        };
    }
}


function validateFields(credentials: any, name: string, bio: String): UserPayload{
    if(!validator.isEmail(credentials.email)){
        return userErrorMessage("Invalid email")
    }

    if(!validator.isLength(credentials.password, {min: 5})){
        return userErrorMessage("Password needs to be at least 5 characters long")
    }

    if(!name || !bio){
        return userErrorMessage("Name and Bio are mandatory fields")
    }

    return {
        userErrors:[],
        token: null
    };
}