import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import UserReply from './userReply';
import { CommentProp, Reply } from '../../app/types';

interface UserCommentProps {
  comment: CommentProp;
  navigation: any;
  onReply: () => void;
  replies: Reply[];
}

const UserComment: React.FC<UserCommentProps> = ({ comment, navigation, onReply, replies }) => {
  const [liked, setLiked] = useState(comment.liked);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <ScrollView className="border-b border-gray-200">
      <View className="p-4">
        <View className="flex-row">
          <Image source={{ uri: comment.author.avatar }} className="w-10 h-10 rounded-full mr-3" />
          <View className="flex-1">
            <Text className="text-gray-500 text-[12px]">{comment.author.name}</Text>
            <Text className="mt-1">{comment.content}</Text>
            <View className="flex-row mt-2 items-center">
              <TouchableOpacity onPress={handleLike} className="flex-row items-center mr-4">
                <AntDesign name={liked ? "heart" : "hearto"} size={16} color={liked ? "red" : "black"} />
                <Text className="ml-1">{likesCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleReplies} className="flex-row items-center mr-4">
                <Feather name="message-circle" size={16} color="black" />
                <Text className="ml-1">{replies.length} Replies</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onReply} className="flex-row items-center">
                <Feather name="corner-up-left" size={16} color="black" />
                <Text className="ml-1">Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {showReplies && replies.length > 0 && (
          <View className="mt-2">
            {replies.map((reply) => (
              <UserReply key={reply.id} reply={reply} navigation={navigation} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UserComment;