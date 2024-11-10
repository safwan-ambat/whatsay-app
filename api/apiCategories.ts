import APIService, { APICaller } from "./APIKit";

export const getAllCategories = async () => {
    try {
        const res = await APICaller(APIService.get('/categories'))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

// API function to fetch all categories that have associated articles
export const getCategories = async () => {
    try {
        const res = await APICaller(APIService.get('/categoryWithArticles'))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

