// components/Navbar/index.tsx
import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import menuIcon from '@/assets/iconMenu.webp';
import { useSelector } from "react-redux";
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';

const NavBar = () => {
  const router = useRouter();
  const loggedInUserData = useSelector(loggedInUserDataSelector);

  const handleProfilePress = () => {
    if (loggedInUserData) {
      router.push('/profileScreen');
    } else {
      router.push('/login/loginScreen');
    }
  };

  return (
    <View className="absolute top-0 left-0 right-0 z-10">
      <View className="flex-row justify-between items-center pt-4 px-[18px] pb-5 rounded-b-[60px] bg-white">
        <TouchableOpacity onPress={handleProfilePress}>
          {loggedInUserData ? (
            <Image
              source={{ uri: loggedInUserData.user?.pic }}
              className="w-[40px] h-[40px] rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={menuIcon}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        <Text className="font-domine text-2xl text-black">Discover</Text>
        <View className="w-9 h-9">
          {/* <Image source={searchIcon} className="w-9 h-9 hidden" resizeMode="contain" /> */}
        </View>
      </View>
    </View>
  );
};

export default NavBar;