import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';
import { AuthPayload } from '@/types/UserTypes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const ProfileDetailsScreen = () => {
  const loggedInUserData: AuthPayload | null = useSelector(loggedInUserDataSelector);
  type Route = Href<string>;
  // Redirect to login if no user data
  if (!loggedInUserData?.user) {
    router.replace('/(auth)/login' as Route);
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
       <Image
        source={require("@/assets/profileBg.webp")}
        className="absolute w-screen h-[406px]"
        resizeMode="cover"
      />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-domine">Profile</Text>
        <View className="w-8" />
      </View>

      {/* Profile Picture Section */}
      <View className="items-center mt-8">
        <View className="relative">
          <Image
            source={{ uri: loggedInUserData.user.pic }}
            className="w-[120px] h-[120px] rounded-full border-white border-[3px]"
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute bottom-0 right-0">
            <View className='h-[36px] w-[36px] bg-white rounded-full items-center justify-center'>
                <View className="h-[30px] w-[30px] bg-[#7A84B7] border-[#6570A6] border-2 rounded-full items-center justify-center">
                <MaterialIcons name="edit" size={20} color="white" />
                </View>
            </View>
               
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Details */}
      <View className="px-4 mt-12">
        {/* Name Section */}
        <View className="">
          <Text className="text-[16px] font-domine text-gray-900 pb-[6px]">Name</Text>
          <View className="flex-row justify-between items-center border-b border-gray-200 pb-[20px]">
            <Text className="text-[20px] font-geist text-[#000000]/60">
              {loggedInUserData.user.name}
            </Text>
            <TouchableOpacity onPress={() => {/* Handle name edit */}}>
            <MaterialIcons name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Email Section */}
        <View className='pt-[20px]'>
          <Text className="text-[16px] font-domine text-gray-900 pb-[6px]">Email Address</Text>
          <View className="flex-row justify-between items-center  py-0">
            <Text className="text-[20px] font-geist text-[#000000]/60">
              {loggedInUserData.user.email}
            </Text>
            <TouchableOpacity onPress={() => {/* Handle email edit */}}>
            <MaterialIcons name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;