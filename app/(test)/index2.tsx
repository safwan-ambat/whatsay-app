// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CommentSectionModal from '@/components/comment/commentSectionModal';

// const Index2 = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const openModal = () => setIsModalVisible(true);
//   const closeModal = () => setIsModalVisible(false);

//   return (
//     <SafeAreaView className="h-full bg-slate-500 flex-1">
//       <View className="flex-1 items-center justify-center">
//         <Text className="font-bold text-[40px] text-white mb-4">Test File</Text>
//         <TouchableOpacity
//           onPress={openModal}
//           className="bg-blue-500 py-2 px-4 rounded-lg"
//         >
//           <Text className="text-white font-semibold">Open Comments</Text>
//         </TouchableOpacity>
//       </View>
//       <CommentSectionModal
//         postId="1"
//         isVisible={isModalVisible}
//         onClose={closeModal}
//       />
//     </SafeAreaView>
//   );
// };

// export default Index2;