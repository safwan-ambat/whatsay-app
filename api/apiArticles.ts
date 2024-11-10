import APIService, { APICaller } from "./APIKit";

export const getAllArticlesByCategories = async (categoryId: string) => {
    try {
        const res = await APICaller(APIService.get(`/newsByCategory?id=${categoryId}`))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}