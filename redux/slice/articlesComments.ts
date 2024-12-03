import { ArticleComment } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Define the state type
export interface CommentsState {
    comments: ArticleComment[]; // Array of comments
}

// Initial state
const initialState: CommentsState = {
    comments: [], // Start with an empty array
};

// Create the slice
export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        // Properly type the `state` and `action` parameters
        setComment: (state, action: PayloadAction<ArticleComment[]>) => {
            state.comments = action.payload; // Replace the comments array
        },
        updateLike: (state, action) => {
            state.comments.map((comment: ArticleComment) => {
                if (comment.id == action.payload.commentId) {
                    comment.likes = action.payload.response
                }
            })
        }
    },
});

export const { setComment, updateLike } = commentSlice.actions;

// Add typing for the `state` parameter in selectors
export const commentsDataSelector = (state: { comments: CommentsState }) => state.comments.comments;

export default commentSlice.reducer;