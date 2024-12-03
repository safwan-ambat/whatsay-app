import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ArticleComment } from '../../app/types';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';
import { apiCommentLikesToogle, apigetAllComments } from '@/api/apiComments';
import { setComment } from '@/redux/slice/articlesComments';

interface UserReplyProps {
  reply: ArticleComment;
  navigation: any;
  postId: string;
}

const UserReply: React.FC<UserReplyProps> = ({ reply, navigation, postId }) => {
  const loggedInUserData = useSelector(loggedInUserDataSelector);
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      await apiCommentLikesToogle(reply.id, loggedInUserData.user.id).then(async (response) => {
        await apigetAllComments(postId).then((response) => {
          dispatch(setComment(response))
        })
      })
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className="pl-12 pr-4 py-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row">
          <Image source={{ uri: reply.user?.pic }} className="w-8 h-8 rounded-full mr-2" />
          <View className="flex-1">
            <Text className="font-geist text-[#000000]/60 text-[12px] capitalize">{reply.user.name}</Text>
            <Text className="mt-1 font-geist text-[#000000] text-[16px]">{reply.comment}</Text>
            <View className="flex-row mt-2 items-center">
              <TouchableOpacity onPress={handleLike} className="flex-row items-center">
                <AntDesign name={reply.likes?.includes(loggedInUserData.user.id) ? "heart" : "hearto"} size={14} color={reply.likes?.includes(loggedInUserData.user.id) ? "red" : "black"} />
                <Text className="ml-1 text-[12px]">{reply.likes?.length ?? 0}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserReply;