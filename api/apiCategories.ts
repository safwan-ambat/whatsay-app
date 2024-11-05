import { supabase } from "@/config/supabase"

export const getAllCategories = async () => {
    try {

        const { data: todos, error } = await supabase
            .from("categories")
            .select("*")  // Join with articles
            .order('order', { ascending: true });

        if (error) {
            throw new Error(error.message); // Pass the error message explicitly
        }

        return todos;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

// API function to fetch all categories that have associated articles
export const getCategories = async () => {
    try {

        const { data: todos, error } = await supabase
            .from("categories")
            .select("*, articles!inner(*)", { count: 'exact' })  // Join with articles
            .order('order', { ascending: true });

        if (error) {
            throw new Error(error.message); // Pass the error message explicitly
        }

        return todos;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

