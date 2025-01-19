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
            state.comments = action.payload;
        },
        updateLike: (state, action) => {
            state.comments.map((comment: ArticleComment) => {
                if (comment.id == action.payload.commentId) {
                    comment.likes = action.payload.response
                }
            })
        },
        setReplyComment: (state, action: PayloadAction<any>) => {
            const replyCommentId = action.payload.replyCommentId;
            const repliedComment = action.payload.res;

            state.comments.map((comment: ArticleComment) => {
                if (comment.id == replyCommentId) {
                    comment.replies.unshift(repliedComment[0])
                }
            })
        }
    },
});

export const { setComment, updateLike, setReplyComment } = commentSlice.actions;

// Add typing for the `state` parameter in selectors
export const commentsDataSelector = (state: { comments: CommentsState }) => state.comments.comments;

export default commentSlice.reducer;