import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileDetails() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <View className="flex-row items-center mt-4 relative">
        <TouchableOpacity
          onPress={router.back}
          className="absolute left-0 top-0 z-10"
        >
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
}