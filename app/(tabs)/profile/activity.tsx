import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { router, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';
import { AuthPayload } from '@/types/UserTypes';

type Route = Href<string>;

interface Comment {
  id: string;
  newsTitle: string;
  newsImage: any;
  comment: string;
  timestamp: string;
  userInitial: string;
}

const ActivityScreen = () => {
  // Mock comments data - replace with actual data from your backend
  const comments: Comment[] = [
    {
      id: '1',
      newsTitle: 'LSG hand RCB their 2nd straight defeat at home, might win the IPL cup',
      newsImage: require('@/assets/images/icon.png'),
      comment: 'Kya team hai bhai! LSG undefeatable hai 🔥',
      timestamp: '1 day ago',
      userInitial: 'R'
    },
    // Add more comment objects as needed
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-domine">Activity</Text>
        <View className="w-8" />
      </View>

      {/* Section Title */}
      <Text className="text-2xl font-domine px-4 py-4">
        News you've commented on
      </Text>

      {/* Comments List */}
      <ScrollView className="flex-1">
        {comments.map((comment) => (
          <View key={comment.id} className="px-4 mb-6">
            <TouchableOpacity 
              className="flex-row space-x-3 mb-2"
              onPress={() => {/* Navigate to news article */}}
            >
              <Image 
                source={comment.newsImage}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
              <Text className="flex-1 text-base font-medium">
                {comment.newsTitle}
              </Text>
            </TouchableOpacity>

            {/* Comment Section */}
            <View className="flex-row items-start ml-[76px]">
              {/* User Avatar */}
              <View className="w-8 h-8 rounded-full bg-purple-200 items-center justify-center mr-2">
                <Text className="text-purple-600 font-medium">
                  {comment.userInitial}
                </Text>
              </View>

              {/* Comment Content */}
              <View className="flex-1">
                <Text className="text-base mb-1">{comment.comment}</Text>
                <Text className="text-gray-500 text-sm">{comment.timestamp}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityScreen;