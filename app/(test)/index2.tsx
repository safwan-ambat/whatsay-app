import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import img from '@/assets/meditation-images/meditate-under-tree.webp';
import img2 from '@/assets/meditation-images/trees.webp';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const sampleProfiles = [
  { id: 1, name: 'Alice', age: 28, image: img },
  { id: 2, name: 'Bob', age: 32, image: img2 },
  { id: 3, name: 'Charlie', age: 25, image: img },
  { id: 4, name: 'David', age: 30, image: img },
  { id: 5, name: 'Eva', age: 27, image: img },
];

const TinderSwipe = () => {
  const [cards, setCards] = useState(sampleProfiles);
  const activeIndex = useSharedValue(0);
  const swipe = useSharedValue({ x: 0, y: 0 });
  const rotation = useSharedValue(0);
  const likeOpacity = useSharedValue(0);
  const dislikeOpacity = useSharedValue(0);

  const moveCardToBack = useCallback(() => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const [firstCard] = newCards.splice(0, 1);
      newCards.push(firstCard);
      return newCards;
    });
    activeIndex.value = withTiming(0, { duration: 300 });
    swipe.value = { x: 0, y: 0 };
    rotation.value = withTiming(0, { duration: 300 });
  }, []);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      rotation.value = withTiming(0);
    })
    .onUpdate((event) => {
      'worklet';
      swipe.value = { x: event.translationX, y: event.translationY };
      likeOpacity.value = interpolate(event.translationX, [0, SCREEN_WIDTH/4], [0, 1]);
      dislikeOpacity.value = interpolate(event.translationX, [-SCREEN_WIDTH/4, 0], [1, 0]);
    })
    .onEnd((event) => {
      'worklet';
      const swipeMagnitude = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      if (swipeMagnitude > SWIPE_THRESHOLD) {
        swipe.value = withSpring(
          { x: Math.sign(event.translationX) * SCREEN_WIDTH * 1.5, y: event.translationY },
          {},
          () => {
            runOnJS(moveCardToBack)();
          }
        );
        activeIndex.value = withTiming(cards.length - 1, { duration: 300 });
      } else {
        swipe.value = withSpring({ x: 0, y: 0 });
      }
      likeOpacity.value = withTiming(0);
      dislikeOpacity.value = withTiming(0);
    });

  const renderCard = useCallback((card: any, index: number) => {
    const isFirst = index === 0;

    const cardStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.95, 1, 1.05]
      );

      const translateY = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [-15, 0, 15]
      );

      const rotateZ = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [-5, 0, 5]
      );

      return {
        transform: [
          { translateX: isFirst ? swipe.value.x : 0 },
          { translateY: isFirst ? swipe.value.y : translateY },
          { scale },
          { rotateZ: `${isFirst ? rotation.value : rotateZ}deg` },
        ],
        opacity: interpolate(index, [0, 3], [1, 0.5]),
        zIndex: cards.length - index,
      };
    });

    return (
      <Animated.View key={card.id} style={[styles.card, cardStyle]}>
        <Image source={card.image} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{card.name}, {card.age}</Text>
        </View>
      </Animated.View>
    );
  }, [cards, swipe, rotation, activeIndex]);

  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
  }));

  const dislikeStyle = useAnimatedStyle(() => ({
    opacity: dislikeOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['rgb(255, 96, 54)', 'rgb(253, 38, 122)']}
      style={styles.container}
    >
      <View style={styles.swiper}>
        <GestureDetector gesture={gesture}>
          <View style={styles.cardContainer}>
            {cards.map(renderCard)}
          </View>
        </GestureDetector>
        <Animated.View style={[styles.likeDislike, styles.like, likeStyle]}>
          <Text style={styles.likeDislikeText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.likeDislike, styles.dislike, dislikeStyle]}>
          <Text style={styles.likeDislikeText}>NOPE</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  likeDislike: {
    position: 'absolute',
    top: 40,
    padding: 10,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'white',
  },
  like: {
    left: 20,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
  },
  dislike: {
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  likeDislikeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default TinderSwipe;