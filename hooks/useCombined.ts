import { useRef, useState, useCallback } from 'react';
import { PanResponder, Dimensions, Platform, Animated } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY = 0.3;
const VERTICAL_THRESHOLD = -10;
const DOWN_SWIPE_THRESHOLD = 50;
const DISMISS_THRESHOLD = 100; // Threshold for dismissing the modal

interface UseCombinedSwipeProps {
  data: any[];
  currentIndex: number;
  onSwipeLeft?: (index: number) => void;
  onSwipeRight?: (index: number) => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  isCommentModalVisible?: boolean;
}

export const useCombinedSwipe = ({
  data,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  isCommentModalVisible = false
}: UseCombinedSwipeProps) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const bottomThreshold = Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.7;
  const hasCalledSwipeUp = useRef(false);
  const hasCalledSwipeDown = useRef(false);
  
  // Animation values
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const resetAnimations = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (onSwipeDown) onSwipeDown();
    });
  }, [onSwipeDown]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      
      if (isCommentModalVisible) return false;

      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < 0 && evt.nativeEvent.pageY > bottomThreshold) {
          return true;
        }
        if (dy > 0) {
          return true;
        }
      } else if (Math.abs(dx) > Math.abs(dy)) {
        setScrollEnabled(false);
        return true;
      }
      
      return false;
    },
    
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;

      if (Math.abs(dy) > Math.abs(dx)) {
        if (!isCommentModalVisible) {
          // Handle swipe up
          if (!hasCalledSwipeUp.current && 
              dy < VERTICAL_THRESHOLD && 
              evt.nativeEvent.pageY > bottomThreshold && 
              onSwipeUp) {
            hasCalledSwipeUp.current = true;
            onSwipeUp();
            return;
          }
          
          // Handle swipe down with live animation
          if (dy > 0) {
            translateY.setValue(dy * 0.5); // Add resistance to the swipe
            const newOpacity = Math.max(0, 1 - (dy / SCREEN_HEIGHT) * 2);
            opacity.setValue(newOpacity);
            const newScale = Math.max(0.95, 1 - (dy / SCREEN_HEIGHT) * 0.2);
            scale.setValue(newScale);
          }
        }
      }

      // Handle horizontal swipes
      if (Math.abs(dx) > Math.abs(dy) && !isCommentModalVisible) {
        const direction = Math.sign(dx);
        const isActionActive = Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(gestureState.vx) > SWIPE_VELOCITY;

        if (isActionActive) {
          if (direction > 0 && currentIndex > 0) {
            onSwipeRight?.(currentIndex - 1);
          } else if (direction < 0 && currentIndex < data.length - 1) {
            onSwipeLeft?.(currentIndex + 1);
          }
        }
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      const { dy } = gestureState;
      setScrollEnabled(true);
      hasCalledSwipeUp.current = false;
      
      if (!isCommentModalVisible && dy > DISMISS_THRESHOLD) {
        animateOut();
      } else {
        resetAnimations();
      }
    },

    onPanResponderTerminate: () => {
      setScrollEnabled(true);
      hasCalledSwipeUp.current = false;
      resetAnimations();
    }
  });

  const animatedStyle = {
    transform: [
      { translateY },
      { scale }
    ],
    opacity
  };

  return {
    panResponder,
    scrollEnabled,
    animatedStyle
  };
};