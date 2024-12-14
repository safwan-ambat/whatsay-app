import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput, Platform, 
  Keyboard, KeyboardAvoidingView, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { NativeViewGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import UserComment from './userComment';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';
import { useRouter } from 'expo-router';
import { apiAddArticleComment, apigetAllComments } from '@/api/apiComments';
import { commentsDataSelector, setComment, setReplyComment } from '@/redux/slice/articlesComments';
import { useCommentSectionAnimation, commentSectionStyles as styles } from '@/hooks/useCommentsection';
import { ExpandableInputProps } from '@/types';

interface CommentSectionModalProps {
  postId: string;
  isVisible: boolean;
  onClose: () => void;
}

const ExpandableInput: React.FC<ExpandableInputProps> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  placeholderTextColor,
  replyingTo, 
  onCancelReply,
  inputRef // Add input ref prop
}) => {
  const [inputHeight, setInputHeight] = useState(48);

  // Focus input when replyingTo changes
  useEffect(() => {
    if (replyingTo && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  return (
    <View style={styles.expandableInputContainer}>
      {replyingTo && (
        <View style={styles.replyingToInner}>
          <Text style={styles.replyingToText}>
            Replying to <Text className='capitalize'>{replyingTo?.user.name}</Text>
          </Text>
          <TouchableOpacity onPress={onCancelReply}>
            <AntDesign name="close" size={16} color="#9DA2A9" />
          </TouchableOpacity>
        </View>
      )}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
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
  const dispatch = useDispatch();
  const [replies, setReplies] = useState<any>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  
  const loggedInUserData = useSelector(loggedInUserDataSelector);
  const commentsData = useSelector(commentsDataSelector);
  const router = useRouter();

  const { scrollTo, gestureHandler, rBottomSheetStyle } = useCommentSectionAnimation(onClose);

  // Enhanced keyboard handling
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard shows
        if (flatListRef.current) {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        scrollTo(0);
        await apigetAllComments(postId).then((response) => {
          dispatch(setComment(response))
        })
      } catch (error) {
        console.log("Comments Fetching Error", error)
      }
    })()
  }, [isVisible, scrollTo]);

  const handlePostComment = async () => {
    if (!loggedInUserData) {
      router.push('/login/loginScreen');
      return;
    }

    if (newComment.trim() === '') return;

    try {
      if (replyingTo) {
        const replyCommentId = replyingTo.id;
        const res = await apiAddArticleComment(
          newComment.trim(), 
          loggedInUserData.user.id, 
          postId, 
          replyCommentId
        );
        dispatch(setReplyComment({ replyCommentId, res }));
        setNewComment('');
        setReplyingTo(null);
      } else {
        const res = await apiAddArticleComment(
          newComment.trim(), 
          loggedInUserData.user.id, 
          postId
        );
        const oldComments = [...commentsData.flat()];
        const newComments = [...oldComments, ...res];
        dispatch(setComment(newComments));
        setNewComment('');
      }
      
      Keyboard.dismiss();
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      console.log("Error posting comment:", error);
    }
  };
  
  const handleReply = useCallback((comment: Comment) => {
    setReplyingTo(comment);
    // Focus input when reply is initiated
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (!isVisible) return null;

  const INPUT_CONTAINER_HEIGHT = 94;
  
  return (
    <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
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
                data={commentsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UserComment
                    comment={item}
                    navigation={navigation}
                    onReply={() => handleReply(item)}
                    replies={replies[item.id] || []}
                    postId={postId}
                  />
                )}
                style={styles.commentList}
                contentContainerStyle={{
                  paddingBottom: INPUT_CONTAINER_HEIGHT + keyboardHeight + 16
                }}
              />
            </NativeViewGestureHandler>

            <BlurView intensity={10} tint="light" style={[styles.inputContainer, { bottom: keyboardHeight }]}>
              <LinearGradient
                colors={['rgba(243, 244, 246, 0)', '#F3F4F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              />
              <View style={styles.inputField}>
                <View style={styles.inputWrapper}>
                  <ExpandableInput
                    inputRef={inputRef}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                    placeholderTextColor="#C4C4C4"
                    replyingTo={replyingTo}
                    onCancelReply={() => {
                      setReplyingTo(null);
                      Keyboard.dismiss();
                    }}
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

export default CommentSectionModal;