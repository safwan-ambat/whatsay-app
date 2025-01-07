import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, loggedInUserDataSelector } from '@/redux/slice/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deletUser } from '@/api/apiUser';
import LottieView from 'lottie-react-native';
import { AuthPayload } from '@/types/UserTypes';

type Route = Href<string>;

const PrivacySettingsScreen = () => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const animation = useRef<LottieView>(null);
  const loggedInUserData: AuthPayload | null = useSelector(loggedInUserDataSelector);

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
        router.replace("/discoverScreen" as Route);
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 ">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-domine">Privacy Settings</Text>
        <View className="w-8" />
      </View>

      {/* Settings List */}
      <View className="px-4 mt-4">
        {/* Privacy */}
        <TouchableOpacity 
          className="flex-row items-center justify-between py-4 border-b border-gray-100"
          onPress={() => router.push('/(tabs)/profile/privacy/details' as Route)}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 items-center justify-center mr-3">
              <Image
                source={require('@/assets/images/profileIcons/private.webp')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-lg">Privacy</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Terms & Conditions */}
        <TouchableOpacity 
          className="flex-row items-center justify-between py-4 "
          onPress={() => router.push('/(tabs)/profile/privacy/terms' as Route)}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 items-center justify-center mr-3">
              <Image
                source={require('@/assets/images/profileIcons/terms.webp')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-lg">Terms & Conditions</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Delete Account Button */}
      <View className="px-4 mt-auto mb-8">
        <TouchableOpacity
          className="bg-[#FFE9E9] rounded-xl py-4 flex justify-center items-center"
          onPress={handleDeleteAccount}
        >
          {!isDeleting && (
            <Text className="text-[#B01212] text-center text-base">
              Delete your account
            </Text>
          )}
          {isDeleting && (
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 20,
                height: 20,
              }}
              source={require("@/assets/animations/loading.json")}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PrivacySettingsScreen;