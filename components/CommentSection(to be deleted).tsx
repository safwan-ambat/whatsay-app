import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder, FlatList, TextInput, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface PullUpCommentSectionProps {
  comments: Comment[];
  onAddComment?: (content: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const { height: screenHeight } = Dimensions.get('window');
const COMMENT_SECTION_HEIGHT = screenHeight * 0.46;

const PullUpCommentSection: React.FC<PullUpCommentSectionProps> = ({ 
  comments, 
  onAddComment, 
  isOpen, 
  setIsOpen 
}) => {
  const [newComment, setNewComment] = useState('');
  const translateY = useRef(new Animated.Value(COMMENT_SECTION_HEIGHT)).current;

  useEffect(() => {
    if (isOpen) {
      openComments();
    } else {
      closeComments();
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const newTranslateY = Math.max(0, Math.min(gestureState.dy, COMMENT_SECTION_HEIGHT));
        translateY.setValue(newTranslateY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > COMMENT_SECTION_HEIGHT / 2 || gestureState.vy > 0.5) {   
          setIsOpen(false);
        } else {
          openComments();
        }
      },
    })
  ).current;

  const openComments = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const closeComments = () => {
    Animated.spring(translateY, {
      toValue: COMMENT_SECTION_HEIGHT,
      useNativeDriver: true,
      tension: 75,
      friction: 10,
    }).start();
  };

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <StyledView className="p-4 border-b border-gray-100">
      <StyledView className="flex-row items-center mb-2">
        <StyledView className="w-8 h-8 rounded-full bg-gray-300 mr-2 items-center justify-center">
          <StyledText className="text-lg font-bold">{item.author[0]}</StyledText>
        </StyledView>
        <StyledView>
          <StyledText className="font-bold">{item.author}</StyledText>
          <StyledText className="text-xs text-gray-500">{item.timestamp}</StyledText>
        </StyledView>
      </StyledView>
      <StyledText>{item.content}</StyledText>
    </StyledView>
  );

  return (
    <>
      {!isOpen && (
        <TouchableOpacity 
          onPress={() => setIsOpen(true)} 
          className="absolute bottom-4 self-center bg-[#F7F7F7] rounded-full px-[20px] py-[8px]"
        >
          <AntDesign name="up" size={12} color="#9DA2A9" />
        </TouchableOpacity>
      )}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: COMMENT_SECTION_HEIGHT,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: [{ translateY }],
        }}
      >
        <StyledView className="flex-1" {...panResponder.panHandlers}>
          <StyledView className="items-center py-2">
            <StyledView className="w-10 h-1 bg-gray-300 rounded-full" />
          </StyledView>
          <StyledView className="px-4 py-2 border-b border-gray-200">
            <StyledText className="text-lg font-bold">Comments</StyledText>
          </StyledView>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
          />
          <StyledView className="p-4 border-t border-gray-200 flex-row">
            <StyledTextInput
              placeholder="Add a comment..."
              className="flex-1 bg-gray-100 p-2 rounded-full mr-2"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity 
              onPress={handleAddComment} 
              className="bg-blue-500 rounded-full p-2 items-center justify-center"
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      </Animated.View>
    </>
  );
};

export default PullUpCommentSection;