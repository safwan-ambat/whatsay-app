import APIService, { APICaller } from "./APIKit";

export const apiAddArticleComment = async (comment: string, user: string, post: string) => {
    try {
        const res: any = await APICaller(APIService.post(`/comments/add?id=${post}`, {
            comment, user
        }))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

export const apigetAllComments = async (articleId: string) => {
    try {
        const res: any = await APICaller(APIService.get(`/comments/${articleId}`))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

export const apiCommentLikesToogle = async (commentId: string, userId: string) => {
    try {
        const res: any = await APICaller(APIService.put(`/comments/${commentId}/like`, {
            userId
        }))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}