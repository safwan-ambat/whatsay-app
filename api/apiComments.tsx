import { supabase } from "@/config/supabase";
import APIService, { APICaller } from "./APIKit";

export const apiAddArticleComment = async (comment: string, user: string, post: string, parentCommentId?: string) => {
    try {
        // const res: any = await APICaller(APIService.post(`/comments/add?id=${post}`, {
        //     comment, user, commentId: parentCommentId
        // }))
        // return res.data;

        const commentInfo = {
            article_id: post,
            user_id: user,
            comment: comment,
            parent_id: parentCommentId
        }

        // Insert new user into the database
        const { data: todos, error: insertError } = await supabase
            .from('comments')
            .insert(commentInfo).select(
                `*,
                user:users (
                id,
                pic,
                name
              )`
            );

            if (insertError) throw new Error(insertError.message);

            return todos;

    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

export const apigetAllComments = async (articleId: string) => {
    try {
        // const res: any = await APICaller(APIService.get(`/comments/${articleId}`))
        // return res.data;

        // Insert new user into the database
        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
              *,
              user:users (
                id,
                pic,
                name
              ),
              replies:comments!parent_id (
                id,
                comment,
                created_at,
                updated_at,
                user_id,
                likes,
                user:users (
                  id,
                  name,
                  pic
                ),
                replies_count:comments!parent_id (id),
                replies:comments!parent_id (
                  id,
                  comment,
                  created_at,
                  updated_at,
                  user_id,
                  likes,
                  user:users (
                    id,
                    name,
                    pic
                  )
                )
              ),
              replies_count:comments!parent_id (id)
            `)
            .eq('article_id', articleId)
            .is('parent_id', null)
            .order('created_at', { ascending: false });

            if(error) throw new Error("Error in fetching comments");

            return comments;

    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}

export const apiCommentLikesToogle = async (commentId: string, userId: string) => {
    try {
        // const res: any = await APICaller(APIService.put(`/comments/${commentId}/like`, {
        //     userId
        // }))
        // return res.data;

        if(!userId) throw new Error("User ID is required");

        // Fetch the current likes for the comment
        const { data: comment, error: fetchError } = await supabase
            .from('comments')
            .select('likes')
            .eq('id', commentId)
            .single();

            if (fetchError || !comment) throw new Error("Comment not found" );

            const existingLikes = comment.likes || [];
        const hasLiked = existingLikes.includes(userId);

        let updatedLikes;

        if (hasLiked) {
            // If user already liked the comment, remove their ID (dislike)
            updatedLikes = existingLikes.filter((id: string) => id !== userId);
        } else {
            // If user hasn't liked the comment, add their ID (like)
            updatedLikes = [...existingLikes, userId];
        }

        // Update the likes in the database
        const { error: updateError } = await supabase
            .from('comments')
            .update({ likes: updatedLikes })
            .eq('id', commentId);

        if (updateError) {
            throw updateError;
        }

        return updatedLikes;
        
    } catch (error: any) {
        console.log("Fetching Error: ", error.message || error); // Log the error message
        throw new Error(error.message || error); // Re-throw with message for clarity
    }
}