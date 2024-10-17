import { supabase } from "@/config/supabase"

export const getAllArticlesByCategories = async (categoryId: string) => {
    try {
        const { data: todos, error } = await supabase
            .from('articles')
            .select('*')
            .eq("category_id", categoryId)
            .order('published_at', { ascending: true });

        if (error) {
            throw new Error(error.message); // Pass the error message explicitly
        }

        return todos;
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}