// app/loginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleAccountsModal from "@/components/loginModal";
import { useAuth } from '@/config/authContext';

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const googleAccounts = [
    {
      name: "Siddharth JP",
      email: "siddharthjp@gmail.com",
      avatar: require("@/assets/profielSample.jpg"),
    },
    {
      name: "P Design",
      email: "pdesign@olacabs.com",
      avatar: require("@/assets/profileSample2.webp"),
    },
  ];

  const handleAccountSelect = (account: any) => {
    // Login the user
    login({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
    });

    // Navigate to discover screen
    router.replace({
      pathname: "/discoverScreens"
    });
  };

  return (
    <ImageBackground
      source={require("@/assets/loginBg.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 px-[16px]">
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-2xl text-black">←</Text>
        </TouchableOpacity>

        <View className="flex-1 items-center mt-[372px]">
          <View className="mb-[66px] items-center">
            <Text className="font-domine text-[28px] mb-2 text-center text-black">
              News curated
            </Text>
            <Text className="font-domine text-[28px] text-center text-black">
              Perspectives invited
            </Text>
          </View>

          <TouchableOpacity
            className="w-full bg-black rounded-[12px] py-4 px-6 flex-row items-center justify-center mb-4"
            onPress={() => setShowGoogleModal(true)}
          >
            <Image
              source={require("@/assets/googleIcon.webp")}
              className="w-7 h-7 mr-3"
              resizeMode="contain"
            />
            <Text className="text-white font-medium text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-white rounded-[12px] py-4 px-6 flex-row items-center justify-center"
            onPress={() => {
              console.log("Phone sign in pressed");
            }}
          >
            <Image
              source={require("@/assets/mobileIcon.webp")}
              className="w-7 h-7 mr-3"
              resizeMode="contain"
            />
            <Text className="text-black font-medium text-base">
              Continue with Phone
            </Text>
          </TouchableOpacity>
        </View>

        <GoogleAccountsModal
          visible={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSelectAccount={handleAccountSelect}
          accounts={googleAccounts}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;