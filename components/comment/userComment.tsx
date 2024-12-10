import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import UserReply from './userReply';
import replyIcon from '@/assets/reply.webp'
import { ArticleComment } from '@/types';
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { apiCommentLikesToogle } from '@/api/apiComments';
import { updateLike } from '@/redux/slice/articlesComments';
import { useRouter } from 'expo-router';

interface UserCommentProps {
  comment: ArticleComment;
  navigation: any;
  onReply: () => void;
  replies: any;
  postId: string;
}

const UserComment: React.FC<UserCommentProps> = ({ comment, navigation, onReply, replies, postId }) => {

  const loggedInUserData = useSelector(loggedInUserDataSelector);

  const dispatch = useDispatch();
  const router = useRouter()

  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async () => {
    try {
      if (!loggedInUserData) {
        return router.push('/login/loginScreen');
      }else{
        await apiCommentLikesToogle(comment.id, loggedInUserData.user.id)
          .then((response) => {
            dispatch(updateLike({ commentId: comment.id, response }));
          })
      }

    } catch (error) {
      console.log("Failed to like", error);
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <ScrollView className="border-b border-gray-200">
      <View className="p-4">
        <View className="flex-row">
          <Image source={{ uri: comment.user?.pic }} className="w-10 h-10 rounded-full mr-3" />
          <View className="flex-1">
            <Text className=" font-geist text-[#000000]/60 text-[12px] capitalize">{comment.user?.name}</Text>
            <Text className="mt-1 font-geist text-[#000000] text-[16px]">{comment?.comment}</Text>
            <View className="flex-row mt-2 items-center">

              <TouchableOpacity onPress={handleLike} className="flex-row items-center mr-4">
                <AntDesign
                  size={16}
                  name={comment.likes?.includes(loggedInUserData?.user?.id) ? "heart" : "hearto"}
                  color={comment.likes?.includes(loggedInUserData?.user?.id) ? "red" : "black"}
                />
                <Text className="ml-1 font-geist  text-[#000000]/60 text-[12px]">{comment.likes?.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleReplies} className="flex-row items-center mr-4">
                <Feather name="message-circle" size={16} color="gray" />
                <Text className="ml-1">{comment.replies?.length ?? 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onReply} className="flex-row items-center">
                <Image source={replyIcon} style={{ width: 16, height: 16 }} />
              </TouchableOpacity>

            </View>
          </View>
        </View>
        {showReplies && comment.replies.length > 0 && (
          <View className="mt-2">
            {comment.replies.map((reply: any) => (
              <UserReply key={reply.id} reply={reply} navigation={navigation} postId={postId} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UserComment;