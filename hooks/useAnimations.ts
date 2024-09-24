import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Animated, Easing, PanResponder, PanResponderGestureState, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface AnimatedValues {
  imageSize: Animated.Value;
  gradientOpacity: Animated.Value;
  scale: Animated.Value;
  titlePosition: Animated.Value;
  dragIndicator: Animated.Value;
  contentOpacity: Animated.Value;
  modalY: Animated.Value;
}

const SWIPE_THRESHOLD = 100;

export const useNewsItemAnimations = (isCommentSectionOpen: boolean, onClose: () => void) => {
  const animatedValues = useMemo<AnimatedValues>(() => ({
    imageSize: new Animated.Value(100),
    gradientOpacity: new Animated.Value(0),
    scale: new Animated.Value(1),
    titlePosition: new Animated.Value(1),
    dragIndicator: new Animated.Value(1),
    contentOpacity: new Animated.Value(1),
    modalY: new Animated.Value(0),
  }), []);

  const closeModal = useCallback(() => {
    Animated.timing(animatedValues.modalY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      onClose();
      animatedValues.modalY.setValue(0);
    });
  }, [animatedValues.modalY, onClose]);


  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dy, dx }) => {
      return Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5 && !isCommentSectionOpen;
    },
    onPanResponderMove: (_, { dy }) => {
      if (dy > 0 && !isCommentSectionOpen) {
        animatedValues.modalY.setValue(dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (!isCommentSectionOpen) {
        handlePanResponderRelease(gestureState);
      }
    },
  }), [isCommentSectionOpen, animatedValues.modalY]);

  const handlePanResponderRelease = useCallback((gestureState: PanResponderGestureState) => {
    if (!isCommentSectionOpen) {
      if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 5) {
        closeModal();
      } else {
        Animated.spring(animatedValues.modalY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 60,
          friction: 7,
        }).start();
      }
    }
  }, [isCommentSectionOpen, animatedValues.modalY, closeModal]);

 

  useEffect(() => {
    const animations = [
      Animated.timing(animatedValues.imageSize, {
        toValue: isCommentSectionOpen ? 94 : 100,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(animatedValues.gradientOpacity, {
        toValue: isCommentSectionOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.titlePosition, {
        toValue: isCommentSectionOpen ? 0 : 200,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(animatedValues.contentOpacity, {
        toValue: isCommentSectionOpen ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ];

   // Bouncy animation for dragIndicator
   const dragIndicatorAnimation = Animated.sequence([
    Animated.timing(animatedValues.dragIndicator, {
      toValue: isCommentSectionOpen ? -12 : 20,  // Jump up or down
      useNativeDriver: true,
      duration: 500,  // Duration in milliseconds for the first animation
    }),
    Animated.timing(animatedValues.dragIndicator, {
      toValue: isCommentSectionOpen ? 0 : 20,  // Settle back
      useNativeDriver: true,
      duration: 100,  // Duration in milliseconds for the second animation
    })
  ]);

  Animated.parallel([...animations, dragIndicatorAnimation]).start();
}, [isCommentSectionOpen, animatedValues]);
  return {
    animatedValues,
    // panResponder,
    closeModal,
  };
};