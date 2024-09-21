import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
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
    <ScrollView 
      className="pl-12 pr-4 py-8 border-t border-gray-200 bg-red-800"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row">
        <Image source={{ uri: reply.author.avatar }} className="w-8 h-8 rounded-full mr-2" />
        <View className="flex-1">
          <Text className="font-bold text-[12px]">{reply.author.name}</Text>
          <Text className="mt-1">{reply.content}</Text>
          <View className="flex-row mt-2 items-center">
            <TouchableOpacity onPress={handleLike} className="flex-row items-center">
              <AntDesign name={liked ? "heart" : "hearto"} size={14} color={liked ? "red" : "black"} />
              <Text className="ml-1 text-[12px]">{likesCount}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserReply;