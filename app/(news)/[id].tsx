import React, { useCallback } from 'react';
import { View, Platform, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import News_data from '@/constants/news-data';
import ExpandedNewsItem from '@/(news)/expandedScreen';
import { NewsCategory } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { blue } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export default function NewsDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const newsId = parseInt(id, 10);

  // Find the category and index of the news item
  let targetCategory: NewsCategory | undefined;
  let initialIndex = -1;

  for (const category of News_data) {
    const index = category.data.findIndex(item => item.id === newsId);
    if (index !== -1) {
      targetCategory = category;
      initialIndex = index;
      break;
    }
  }

  if (!targetCategory || initialIndex === -1) {
    return (
      <View style={styles.errorContainer}>
        <Text>News item not found</Text>
      </View>
    );
  }

  const handleCloseModal = useCallback(() => {
    router.back();
  }, [router]);

  const ContentWrapper = Platform.OS === 'android' ? GestureHandlerRootView : View;

  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startY: number }>({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // Only allow downward swipes
      if (event.translationY > 0) {
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      if (event.translationY > 100 && event.velocityY > 0) {
        runOnJS(handleCloseModal)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <ContentWrapper style={styles.container}>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetY={[-5, 5]} // Activate after 5 points of vertical movement
        failOffsetX={[-5, 5]} // Fail if there's more than 5 points of horizontal movement
      >
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          <ExpandedNewsItem
            items={targetCategory.data}
            initialIndex={initialIndex}
            isVisible={true}
            onClose={handleCloseModal}
          />
        </Animated.View>
      </PanGestureHandler>
    </ContentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
  },
  contentContainer: {
    flex: 1,
    
    
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});