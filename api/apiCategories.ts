import { supabase } from "@/config/supabase";
import APIService, { APICaller } from "./APIKit";

export const getAllCategories = async () => {
    try {
        const res = await APICaller(APIService.get('/categories'))
        return res.data;

        // const { data: todos, error } = await supabase
        //     .from("categories")
        //     .select("*") // Fetch all categories
        //     .order("order", { ascending: true });

        // if(error) throw new Error(error.message);

        // return todos;

    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

// API function to fetch all categories that have associated articles
export const getCategories = async (from: string, to: string, userId: string) => {
    try {
        const res = await APICaller(APIService.get(`/categoryWithArticles?from=${from}&&to=${to}&&userId=${userId}`))
        return res.data;

        // const { data: todos, error } = await supabase
        //     .from("categories")
        //     .select("*, articles!inner(*)", { count: "exact" }) // Join with articles
        //     .order("order", { ascending: true });

        //     if(error) throw new Error(error.message);

        //     return todos;

    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

export const apiGetCategoriesWithPreferences = async (userId: string) => {
    try {
        const res = await APICaller(APIService.get(`/categoriesWithPreferences/${userId}`))
        return res.data;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

export const apiUpdateUserPreference = async (categoryIDs: string[], userId: string) => {
    try {
        const res = await APICaller(APIService.put(`/updateUserCategoriesPreferences/${userId}`, {
            categoryIDs
        }))
        return res;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}