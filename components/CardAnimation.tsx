import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';

interface CardProps {
  card: {
    id: number;
    title: string;
    image: any;
  };
  index: number;
  totalCards: number;
  activeIndex: SharedValue<number>;
  translateX: SharedValue<number>;
  onSwipe: (direction: 'left' | 'right') => void;
  onPress: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  index,
  totalCards,
  activeIndex,
  translateX,
  onSwipe,
  onPress,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const isFirst = index === 0;

  const removeCard = useCallback((direction: 'left' | 'right') => {
    'worklet';
    runOnJS(onSwipe)(direction);
  }, [onSwipe]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (isFirst) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (isFirst) {
        if (Math.abs(event.velocityX) > 400 || Math.abs(translateX.value) > SCREEN_WIDTH * 0.4) {
          translateX.value = withSpring(Math.sign(translateX.value) * SCREEN_WIDTH);
          const direction = translateX.value > 0 ? 'right' : 'left';
          removeCard(direction);
        } else {
          translateX.value = withSpring(0);
        }
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0.95, 1, 1.05]
    );

    const translateY = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [-30, 0, 30]
    );

    const rotate = interpolate(
      isFirst ? translateX.value : activeIndex.value,
      isFirst ? [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2] : [index - 1, index, index + 1],
      isFirst ? [-10, 0, 10] : [5, 0, -5]
    );

    if (!isFirst) {
      return { 
        transform: [
          { scale },
          { translateY },
          { rotate: `${rotate}deg` },
          { translateY: withSpring(index * 1) },
          { translateX: withSpring(index * 20) },
        ],
        opacity: interpolate(
          index,
          [1, Math.min(totalCards - 1, 3)],
          [1, 0.5]
        ),
      };
    }

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Image source={card.image} style={styles.cardImage} />

          <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)' , 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            >
              <View  style={StyleSheet.absoluteFill} />
            </LinearGradient>
            <Text style={styles.cardTitle}>{card.title}</Text>

        </Animated.View>
      </TouchableOpacity>
    </GestureDetector>
  );
};

{/* <BlurView intensity={20} style={styles.textOverlay}>
              <Text className="font-domine" style={styles.title}>{title}</Text>
            </BlurView> */}



const styles = StyleSheet.create({
  card: {
    width: 273,
    height: 320,
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow:"hidden"
    
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  cardTitle: {
    fontFamily:'Domine',
    fontSize: 18,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    position:"absolute",
    bottom:24,
    paddingHorizontal:16
    
  },


  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: 'white',
    padding: 8,
  },
  
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
   } // Adjust this value to control the height of the gradient
});

