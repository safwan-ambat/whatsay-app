import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Reply } from '../../app/types';

interface UserReplyProps {
  reply: Reply;
  navigation: any;
}

const UserReply: React.FC<UserReplyProps> = ({ reply, navigation }) => {
  const [liked, setLiked] = useState(reply.liked);
  const [likesCount, setLikesCount] = useState(reply.likesCount);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <View className="pl-12 pr-4 py-5">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row">
          <Image source={{ uri: reply.author.avatar }} className="w-8 h-8 rounded-full mr-2" />
          <View className="flex-1">
            <Text className="font-geist text-[#000000]/60 text-[12px]">{reply.author.name}</Text>
            <Text className="mt-1 font-geist text-[#000000] text-[16px]">{reply.content}</Text>
            <View className="flex-row mt-2 items-center">
              <TouchableOpacity onPress={handleLike} className="flex-row items-center">
                <AntDesign name={liked ? "heart" : "hearto"} size={14} color={liked ? "red" : "black"} />
                <Text className="ml-1 text-[12px]">{likesCount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserReply;