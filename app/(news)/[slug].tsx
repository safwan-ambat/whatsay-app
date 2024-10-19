import { getAllArticlesByCategories } from '@/api/apiArticles';
import ExpandNewsItem from '@/components/ExpandNewsItem';
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const ContentWrapper = Platform.OS === 'android' ? GestureHandlerRootView : View;

const NewsDetails = () => {

  const { categoryId, slug } = useLocalSearchParams<{ categoryId: string, slug: string }>();

  const [newsArticles, setNewsArticles] = useState<any>();
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const translateY = useSharedValue(0);
  const router = useRouter();

  const handleCloseModal = useCallback(() => {
    if (!isCommentModalVisible) {
      router.back();
    }
  }, [router, isCommentModalVisible]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startY: number }>({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // Only respond to vertical gestures
      if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      if (event.translationY > 50 && event.velocityY > 50) {
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

  useEffect(() => {
    (async () => {
      const response = await getAllArticlesByCategories(categoryId);
      setNewsArticles(response)
    })()
  }, []);

  if (!newsArticles || !slug) {
    return (
      <View style={styles.errorContainer}>
        <Text>News item not found</Text>
      </View>
    )
  }

  return (
    <ContentWrapper style={styles.container}>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetY={[-10, 10]}
        failOffsetX={[-20, 20]}>
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          <ExpandNewsItem
            items={newsArticles}
            initialArticleId={slug}
            isVisible={true}
            onClose={handleCloseModal}
            setIsCommentModalVisible={setIsCommentModalVisible}
          />
        </Animated.View>
      </PanGestureHandler>
    </ContentWrapper>
  )
}

export default NewsDetails;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "white",
    flex: 1,
  },
});