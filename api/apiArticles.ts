import { supabase } from "@/config/supabase";
import APIService, { APICaller } from "./APIKit";

export const getAllArticlesByCategories = async (categoryId: string,from:string, to:string) => {
    try {
        const res = await APICaller(APIService.get(`/newsByCategory?id=${categoryId}&&from=${from}&&to=${to}`))
        return res.data;

        // if (!categoryId) throw new Error("Category ID Missing!");

        // const { data: todos, error } = await supabase
        //     .from('articles')
        //     .select('*')
        //     .eq("category_id", categoryId)
        //     .limit(20)
        //     .order('published_at', { ascending: true });

        // if (error) throw new Error(error.message);

        // return todos;

    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}