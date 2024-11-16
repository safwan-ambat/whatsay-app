import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlossyButton from '@/components/glossyButton';
import { useDispatch, useSelector } from "react-redux";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser, loggedInUserDataSelector, setUser } from '@/redux/slice/userSlice';

const ProfileScreen = () => {
  const router = useRouter();

  const loggedInUserData = useSelector(loggedInUserDataSelector);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem("user");
    dispatch(clearUser());
    router.replace('/loginScreen');
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    console.log('Delete account pressed');
  };

  if (!loggedInUserData) {
    router.replace('/loginScreen');
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Image
        source={require('@/assets/profileBg.webp')}
        className="absolute w-screen h-[406px]"
        resizeMode="cover"
      />
      <View className="flex-row items-center mt-4 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-0 z-10"
        >
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-[24px] font-domine text-center">Your Profile</Text>
        </View>
      </View>

      <View className="items-center mt-[44px] flex-row justify-center">
        <View className="flex-1 items-center">
          <Image
            source={{ uri: loggedInUserData.user?.photo }}
            className="w-[120px] h-[120px] rounded-full border-white border-[3px]"
            resizeMode="cover"
          />
          <View className="bg-[#868686] px-[1px] py-[1px] rounded-full absolute -bottom-2">
            <GlossyButton />
          </View>
        </View>
      </View>

      <View className="mt-16">
        <View className="mb-8">
          <Text className="text-lg font-domine mb-1">Name</Text>
          <Text className="text-gray-600">{loggedInUserData.user?.name}</Text>
        </View>

        <View>
          <Text className="text-lg font-domine mb-1">Email Address</Text>
          <Text className="text-gray-600">{loggedInUserData.user?.email}</Text>
        </View>
      </View>

      <View className="mt-auto mb-8">
        <TouchableOpacity
          className="bg-black rounded-xl py-4"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-medium">Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 bg-[#FFE9E9] rounded-xl py-4"
          onPress={handleDeleteAccount}
        >
          <Text className="text-[#B01212] text-center">Delete your account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;