import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Dimensions, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeViewGestureHandler, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import UserComment from './userComment';
import { CommentProp, User, Reply } from '../../app/types';
import { mockComments, mockReplies } from '../../constants/commentsData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 1;

interface CommentSectionModalProps {
  postId: string;
  isVisible: boolean;
  onClose: () => void;
}

const CommentSectionModal: React.FC<CommentSectionModalProps> = ({ postId, isVisible, onClose }) => {
  const [comments, setComments] = React.useState<CommentProp[]>([]);
  const [replies, setReplies] = React.useState<{ [key: string]: Reply[] }>(mockReplies);
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<CommentProp | null>(null);
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const translateY = useSharedValue(MODAL_HEIGHT);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 50, stiffness: 300 });
  }, []);

  useEffect(() => {
    if (isVisible) {
      scrollTo(0);
      setComments(mockComments);
    } else {
      scrollTo(MODAL_HEIGHT);
    }
  }, [isVisible, scrollTo]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startY: number }>({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(0, context.startY + event.translationY);
    },
    onEnd: (event) => {
      if (translateY.value > MODAL_HEIGHT / 2 || event.velocityY > 500) {
        scrollTo(MODAL_HEIGHT);
        runOnJS(onClose)();
      } else {
        scrollTo(0);
      }
    },
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handlePostComment = () => {
    if (newComment.trim() === '') return;

    const currentUser: User = {
      id: 'currentUser',
      name: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=0'
    };

    if (replyingTo) {
      const newReply: Reply = {
        id: `reply-${Date.now()}`,
        commentId: replyingTo.id,
        author: currentUser,
        content: newComment,
        timestamp: new Date().toISOString(),
        likesCount: 0,
        liked: false
      };

      setReplies(prevReplies => ({
        ...prevReplies,
        [replyingTo.id]: [...(prevReplies[replyingTo.id] || []), newReply]
      }));

      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === replyingTo.id 
            ? { ...comment, repliesCount: comment.repliesCount + 1 }
            : comment
        )
      );

      setReplyingTo(null);
    } else {
      const newCommentObj: CommentProp = {
        id: `${Date.now()}`,
        author: currentUser,
        content: newComment,
        timestamp: new Date().toISOString(),
        likesCount: 0,
        repliesCount: 0,
        liked: false
      };

      setComments(prevComments => [newCommentObj, ...prevComments]);
    }

    setNewComment('');
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const handleReply = (comment: CommentProp) => {
    setReplyingTo(comment);
  };

  if (!isVisible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.modalContainer, rBottomSheetStyle]}>
          <View style={styles.commentContainer}>
            <View style={styles.dragIndicator} />
            <View style={styles.header}>
              <Text style={styles.headerText}>Comments</Text>
            </View>

            <NativeViewGestureHandler disallowInterruption={true}>
              <FlatList
                ref={flatListRef}
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UserComment 
                    comment={item} 
                    navigation={navigation} 
                    onReply={() => handleReply(item)}
                    replies={replies[item.id] || []}
                  />
                )}
                style={styles.commentList}
              />
            </NativeViewGestureHandler>

            <View style={styles.inputContainer}>
              {replyingTo && (
                <View style={styles.replyingToContainer}>
                  <Text style={styles.replyingToText}>
                    Replying to {replyingTo.author.name}
                  </Text>
                  <TouchableOpacity onPress={() => setReplyingTo(null)}>
                    <AntDesign name="close" size={16} color="black" />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.inputWrapper}>
                <TextInput
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handlePostComment}>
                  <Image source={require('@/assets/commentIcon.webp')} style={styles.commentIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: MODAL_HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F3F4F6',
  },
  commentContainer: {
    height: SCREEN_HEIGHT * 0.536,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F3F4F6',
  },
  dragIndicator: {
    zIndex: 100,
    position: "absolute",
    top: -20,
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontFamily: 'Domine',
    fontSize: 16,
  },
  commentList: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyingToText: {
    fontSize: 14,
    color: 'gray',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    height: 48,
    borderRadius: 100,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  commentIcon: {
    width: 68,
    height: 68,
    transform: [{ translateY: 5 }],
  },
});

export default CommentSectionModal;