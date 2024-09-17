import React, { useState, useCallback, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import PullUpCommentSection from '@/components/CommentSection';
import { Comment, NewsItem } from '@/types';

const StyledView = styled(View);

const { height: screenHeight } = Dimensions.get('window');

interface NewsItemCommentSectionProps {
  currentItem: NewsItem;
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
}

const NewsItemCommentSection: React.FC<NewsItemCommentSectionProps> = ({
  currentItem,
  isCommentSectionOpen,
  setIsCommentSectionOpen,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadComments(currentItem.id);
  }, [currentItem]);

  const loadComments = useCallback((newsId: number) => {
    // Simulated API call, replace with actual API call
    setComments([
      { id: '1', author: 'Akash', content: 'Great article!', timestamp: '2 hours ago' },
      { id: '2', author: 'Jibi', content: 'Very informative.', timestamp: '1 hour ago' },
    ]);
  }, []);

  const handleAddComment = useCallback((content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Current User', // Replace with actual user name
      content,
      timestamp: 'Just now',
    };
    setComments(prevComments => [newComment, ...prevComments]);
    // You might want to send this new comment to your backend here
  }, []);

  return (
    <StyledView style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: screenHeight * 0.4 }}>
      <PullUpCommentSection
        comments={comments}
        onAddComment={handleAddComment}
        isOpen={isCommentSectionOpen}
        setIsOpen={setIsCommentSectionOpen}
      />
    </StyledView>
  );
};

export default NewsItemCommentSection;