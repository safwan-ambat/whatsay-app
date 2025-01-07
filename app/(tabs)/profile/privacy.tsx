// import React from 'react';
// import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
// import { router, Href } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useDispatch } from 'react-redux';
// import { clearUser } from '@/redux/slice/userSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type Route = Href<string>;

// const PrivacySettingsScreen = () => {
//   const dispatch = useDispatch();

//   const handleDeleteAccount = async () => {
//     try {
//       await AsyncStorage.removeItem('user');
//       dispatch(clearUser());
//       router.replace('/(auth)/login' as Route);
//     } catch (error) {
//       console.error('Error deleting account:', error);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Feather name="arrow-left" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-xl font-domine">Privacy Settings</Text>
//         <View className="w-8" />
//       </View>

//       {/* Settings List */}
//       <View className="px-4 mt-4">
//         {/* Privacy */}
//         <TouchableOpacity 
//           className="flex-row items-center justify-between py-4 border-b border-gray-100"
//           onPress={() => router.push('/(tabs)/profile/privacy/details' as Route)}
//         >
//           <View className="flex-row items-center">
//             <View className="w-8 h-8 items-center justify-center mr-3">
//               <Feather name="lock" size={24} color="#4B68FF" />
//             </View>
//             <Text className="text-lg">Privacy</Text>
//           </View>
//           <Feather name="chevron-right" size={24} color="#9CA3AF" />
//         </TouchableOpacity>

//         {/* Terms & Conditions */}
//         <TouchableOpacity 
//           className="flex-row items-center justify-between py-4 border-b border-gray-100"
//           onPress={() => router.push('/(tabs)/profile/privacy/terms' as Route)}
//         >
//           <View className="flex-row items-center">
//             <View className="w-8 h-8 items-center justify-center mr-3">
//               <Feather name="file-text" size={24} color="#4B68FF" />
//             </View>
//             <Text className="text-lg">Terms & Conditions</Text>
//           </View>
//           <Feather name="chevron-right" size={24} color="#9CA3AF" />
//         </TouchableOpacity>
//       </View>

//       {/* Delete Account Button */}
//       <View className="px-4 mt-auto mb-8">
//         <TouchableOpacity
//           className="bg-[#FFE9E9] rounded-xl py-4"
//           onPress={handleDeleteAccount}
//         >
//           <Text className="text-[#B01212] text-center text-base">
//             Delete your account
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PrivacySettingsScreen;