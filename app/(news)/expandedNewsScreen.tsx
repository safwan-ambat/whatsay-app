import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ExpandedNewsItem from '@/(news)/expandedScreen';
import { NewsCategory } from '@/types';

export default function ExpandedNewsScreen() {
  const router = useRouter();
  const { category: categoryString, initialIndex } = useLocalSearchParams<{ category: string, initialIndex: string }>();

  const category: NewsCategory = JSON.parse(categoryString);
  const index = parseInt(initialIndex, 10);

  const handleCloseModal = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <ExpandedNewsItem
        items={category.data}
        initialIndex={index}
        isVisible={true}
        onClose={handleCloseModal}
      />
    </View>
  );
}