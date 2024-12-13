import { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from "react-native-reanimated";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { runOnJS } from 'react-native-reanimated';

const MODAL_HEIGHT = Dimensions.get("window").height * 1;

export const useCommentModalAnimation = (onClose: () => void) => {
  const translateY = useSharedValue(MODAL_HEIGHT);

  const scrollTo = (destination: number) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50, stiffness: 300 });
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(0, context.startY + event.translationY);
    },
    onEnd: (event) => {
      if (translateY.value > MODAL_HEIGHT / 2 || event.velocityY > 500) {
        scrollTo(MODAL_HEIGHT);
        runOnJS(onClose)();
      } else {
        scrollTo(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, gestureHandler, scrollTo };
};
