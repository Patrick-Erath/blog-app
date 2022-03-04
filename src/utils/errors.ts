export function postErrorMessage(errMessage: string){
    return {
        userErrors: [{
            message: errMessage
        }],
        post: null
    }
};

export function userErrorMessage(errMessage: string){
    return {
        userErrors: [{
            message: errMessage
        }],
        token: null
    }
};