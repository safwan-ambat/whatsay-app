import React, { useEffect, useCallback, useRef, useState } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, TextInput, Dimensions, 
  StyleSheet, Image, Platform, Keyboard, KeyboardAvoidingView
} from 'react-native';
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
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 1;

interface CommentSectionModalProps {
  postId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface ExpandableInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  replyingTo: CommentProp | null;
  onCancelReply: () => void;
}


const ExpandableInput: React.FC<ExpandableInputProps> = ({ value, onChangeText, placeholder, replyingTo, onCancelReply }) => {
  const [inputHeight, setInputHeight] = useState(48);

  return (
    <View style={styles.expandableInputContainer}>
      {replyingTo && (
        <View style={styles.replyingToInner}>
          <Text style={styles.replyingToText}>
            Replying to {replyingTo.author.name}
          </Text>
          <TouchableOpacity onPress={onCancelReply}>
            <AntDesign name="close" size={16} color="#9DA2A9" />
          </TouchableOpacity>
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        style={[{ flex: 1 }, { height: Math.max(48, inputHeight) }]}
        onContentSizeChange={(event) => {
          setInputHeight(event.nativeEvent.contentSize.height);
        }}
      />
      
    </View>
  );
};

const CommentSectionModal: React.FC<CommentSectionModalProps> = ({ postId, isVisible, onClose }) => {
  const [comments, setComments] = useState<CommentProp[]>([]);
  const [replies, setReplies] = useState<{ [key: string]: Reply[] }>(mockReplies);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentProp | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

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
    Keyboard.dismiss();

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
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.commentContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
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

            <BlurView intensity={10} tint="light" style={[styles.inputContainer, { bottom: keyboardHeight }]}>
              <LinearGradient
                colors={['rgba(243, 244, 246, 0)', '#F3F4F6']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.inputField}>
                <View style={styles.inputWrapper}>
                  <ExpandableInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                    replyingTo={replyingTo}
                    onCancelReply={() => setReplyingTo(null)}
                  />
                  <TouchableOpacity onPress={handlePostComment}>
                    <Image source={require('@/assets/commentIcon.webp')} style={styles.commentIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </KeyboardAvoidingView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({


  modalContainer: {
    height:"100%" ,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  commentContainer: {
    
    height: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.52 : SCREEN_HEIGHT * 0.53,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F3F4F6',
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


// inputField
expandableInputContainer: {
  flex: 1,
  backgroundColor: "white",
  borderRadius: 24,
  marginRight: -12,
  paddingVertical: 8,
  paddingHorizontal: 16,
},

replyingToInner: {
  
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 4,
},
replyingToText: {
  fontFamily: 'Geist',
  fontSize: 12,
  color: '#9DA2A9',
},


  inputContainer: {
    width:SCREEN_WIDTH,
    position:"absolute",
    height:94,
    bottom:0,
    
  },

  inputField: {
    width:SCREEN_WIDTH,
    paddingHorizontal:16,
  },
  
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal:16,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // input: {
  //   flex: 1,
  //   borderRadius: 100,
  //   paddingHorizontal: 16,
  //   marginRight: -12,
  // },
  commentIcon: {
    width: 68,
    height: 68,
    transform: [
      { translateY: 5 },
      { translateX: 10 }],
  },
});

export default CommentSectionModal;