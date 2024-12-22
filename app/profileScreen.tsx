import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlossyButton from '@/components/glossyButton';
import { useDispatch, useSelector } from "react-redux";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser, loggedInUserDataSelector, setUser } from '@/redux/slice/userSlice';
import useLocation from '@/hooks/useLocation';
import { AuthPayload } from '@/types/UserTypes';
import { deletUser } from '@/api/apiUser';
import LottieView from 'lottie-react-native';

const ProfileScreen = () => {
  const router = useRouter();

  const loggedInUserData: AuthPayload | null = useSelector(loggedInUserDataSelector);
  const { latitude, longitude, errorMsg, location } = useLocation();

  const [isDeleting, setIsDeleteing] = useState<boolean>(false);

  const dispatch = useDispatch();

  const animation = useRef<LottieView>(null);

  const handleLogout = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem("user");
    dispatch(clearUser());
    router.replace('/login/loginScreen');
  };

  const handleDeleteAccount = async () => {
    setIsDeleteing(true)
    const userId = loggedInUserData?.user.id;

    if (!userId) {
      console.log("User id not found");
      setIsDeleteing(false);
      return;
    }

    try {
      const res = await deletUser(userId);

      if (res.deleted) {
        await AsyncStorage.removeItem("user");
        dispatch(clearUser());
        router.replace('/login/loginScreen');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error is:", error.message);
      } else {
        console.log("Unknown error occurred:", error);
      }
    } finally {
      setIsDeleteing(false)
    }

  };

  // console.log("loggedInUserData",loggedInUserData);


  if (!loggedInUserData) {
    router.replace('/login/loginScreen');
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
            source={{ uri: loggedInUserData.user?.pic }}
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

        <View className="mb-8">
          <Text className="text-lg font-domine mb-1">Location</Text>
          <Text className="text-gray-600">{location?.district} / {location?.city} / {location?.country}</Text>
          <Text className="text-gray-600">{location?.timezone}</Text>
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