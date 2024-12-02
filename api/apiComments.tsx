import APIService, { APICaller } from "./APIKit";

export const apiAddArticleComment = async (comment: string, user: string, post: string) => {
    try {
        console.log("user",user);
        
        const res = await APICaller(APIService.post(`/comment/add?id=${post}`,{
            comment, user
        }))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}