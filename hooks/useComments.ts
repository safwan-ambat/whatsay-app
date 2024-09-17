import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types';
import { fetchComments, addNewComment } from '@/services/newsApi';

export const useComments = (newsId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(newsId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [newsId]);

  const addComment = useCallback(async (content: string) => {
    const newComment = await addNewComment(newsId, content);
    setComments(prevComments => [newComment, ...prevComments]);
  }, [newsId]);

  return { comments, addComment };
};