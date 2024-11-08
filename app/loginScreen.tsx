// app/loginScreen.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/loginBg.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 px-[16px]">
        {/* Rest of the component stays the same */}
        <TouchableOpacity onPress={() => router.back()} className="mt-4 ">
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
            onPress={() => {
              console.log("Google sign in pressed");
            }}
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
            className="w-full bg-white  rounded-[12px] py-4 px-6 flex-row items-center justify-center"
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
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
