import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from "react-redux";
import { loggedInUserDataSelector, clearUser } from '@/redux/slice/userSlice';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthPayload } from '@/types/UserTypes';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import { deletUser } from '@/api/apiUser';
import GlossyButton from '@/components/glossyButton';

type Route = Href<string>;

const ProfileScreen = () => {
  const loggedInUserData: AuthPayload | null = useSelector(loggedInUserDataSelector);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const dispatch = useDispatch();
  const animation = useRef<LottieView>(null);

  const menuItems: Array<{ title: string; icon: string; route: Route }> = [
    { title: 'Profile', icon: '👤', route: '/(tabs)/profile/profile' as Route },
    { title: 'Preferences', icon: '⚙️', route: '/(tabs)/profile/preferences' as Route },
    { title: 'Activity', icon: '🕒', route: '/(tabs)/profile/activity' as Route },
    { title: 'Privacy Settings', icon: '🔒', route: '/(tabs)/profile/privacy' as Route },
  ];

  const handleLogout = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem("user");
    dispatch(clearUser());
    router.replace('/(auth)/login' as Route);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const userId = loggedInUserData?.user.id;

    if (!userId) {
      console.log("User id not found");
      setIsDeleting(false);
      return;
    }

    try {
      const res = await deletUser(userId);
      if (res.deleted) {
        await AsyncStorage.removeItem("user");
        dispatch(clearUser());
        router.replace('/(auth)/login' as Route);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error is:", error.message);
      } else {
        console.log("Unknown error occurred:", error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!loggedInUserData?.user) {
    router.replace('/(auth)/login' as Route);
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
          onPress={router.back}
          className="absolute left-0 top-0 z-10"
        >
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>

        
        <View className="flex-1">
        <View className="items-center mt-[0px] pb-[28px] flex-row justify-center">
        <View className="flex-1 items-center">
      <Image
         source={{ uri: loggedInUserData.user?.pic }}
          className="w-[120px] h-[120px] rounded-full border-white border-[3px]"
          resizeMode="cover"
          />
           <View className="bg-[#868686] px-[1px] py-[1px] rounded-full absolute -bottom-2">
            <GlossyButton />
        </View>
       </View>
        
      </View>
          <Text className="text-[24px] font-domine text-center">{loggedInUserData.user?.name}</Text>
          
        </View>
      </View>

     

      <View className="mt-16">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-gray-100"
            onPress={() => router.push(item.route)}
          >
            <Text className="text-2xl mr-4">{item.icon}</Text>
            <Text className="flex-1 text-lg">{item.title}</Text>
            <Text className="text-gray-400">→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-auto mb-8">
        <TouchableOpacity
          className="bg-black rounded-xl py-4"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-medium">Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 bg-[#FFE9E9] rounded-xl py-4 flex justify-center items-center"
          onPress={handleDeleteAccount}
        >
          {!isDeleting && <Text className="text-[#B01212] text-center">Delete your account</Text>}
          {isDeleting && <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 20,
              height: 20
            }}
            source={require('@/assets/animations/loading.json')}
          />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;