// import React, { useState, useCallback } from 'react';
// import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import img from '@/assets/meditation-images/meditate-under-tree.webp';
// import img2 from '@/assets/meditation-images/trees.webp';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   runOnJS,
//   interpolate,
//   SharedValue,
// } from 'react-native-reanimated';
// import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// type CardData = {
//   id: number;
//   name: string;
//   age: number;
//   image: any;
// };

// const SAMPLE_CARDS: CardData[] = [
//   { id: 1, name: 'Alice', age: 228, image: img },
//   { id: 2, name: 'Bob', age: 32, image: img2 },
//   { id: 3, name: 'Charlie', age: 25, image: img },
//   { id: 4, name: 'David', age: 30, image: img2 },
//   { id: 5, name: 'Eva', age: 27, image: img },
// ];

// const HorizontalSwipeCardStack: React.FC = () => {
//   const { width: SCREEN_WIDTH } = useWindowDimensions();
//   const [cards, setCards] = useState<CardData[]>(SAMPLE_CARDS);
//   const activeIndex = useSharedValue(0);
//   const translateX = useSharedValue(0);

//   const removeTopCard = useCallback(() => {
//     setCards(prevCards => {
//       const [removedCard, ...rest] = prevCards;
//       const newCard = { ...removedCard, id: Date.now() };
//       return [...rest, newCard];
//     });
//     translateX.value = 0;
//     activeIndex.value = 0;
//   }, [translateX, activeIndex]);

//   const panGesture = Gesture.Pan()
//     .activeOffsetX([-10, 10])
//     .onUpdate((event) => {
//       translateX.value = event.translationX;
//     })
//     .onEnd((event) => {
//       if (Math.abs(event.velocityX) > 400 || Math.abs(translateX.value) > SCREEN_WIDTH * 0.4) {
//         translateX.value = withSpring(Math.sign(translateX.value) * SCREEN_WIDTH);
//         activeIndex.value = withTiming(activeIndex.value + 1, {}, () => {
//           runOnJS(removeTopCard)();
//         });
//       } else {
//         translateX.value = withSpring(0);
//       }
//     });

//   const CardComponent: React.FC<{
//     card: CardData;
//     index: number;
//     totalCards: number;
//     activeIndex: SharedValue<number>;
//     translateX: SharedValue<number>;
//   }> = useCallback(
//     ({ card, index, totalCards, activeIndex, translateX }) => {
//       const isFirst = index === 0;
//       const animatedCardStyle = useAnimatedStyle(() => {
//         const scale = interpolate(
//           activeIndex.value,
//           [index - 1, index, index + 1],
//           [0.95, 1, 1.05]
//         );

//         const translateY = interpolate(
//           activeIndex.value,
//           [index - 1, index, index + 1],
//           [-30, 0, 30]
//         );

//         const rotate = interpolate(
//           isFirst ? translateX.value : activeIndex.value,
//           isFirst ? [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2] : [index - 1, index, index + 1],
//           isFirst ? [-10, 0, 10] : [5, 0, -5]
//         );

//         if (!isFirst) {
//           return { 
//             transform: [
//               { scale },
//               { translateY },
//               { rotate: `${rotate}deg` },
//               { translateY: withSpring(index * 1) },
//               { translateX: withSpring(index * 20) },
//             ],
//             opacity: interpolate(
//               index,
//               [1, Math.min(totalCards - 1, 3)],
//               [1, 0.5]
//             ),
//           };
//         }

//         return {
//           transform: [
//             { translateX: translateX.value },
//             { rotate: `${rotate}deg` },
//           ],
//         };
//       });

//       return (
//         <Animated.View style={[styles.card, animatedCardStyle]}>
//           <Image source={card.image} style={styles.cardImage} />
//           <View style={styles.cardInfo}>
//             <Text style={styles.cardName}>{card.name}, {card.age}</Text>
//           </View>
//         </Animated.View>
//       );
//     },
//     []
//   );

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <View style={styles.cardContainer}>
//         <GestureDetector gesture={panGesture}>
//           <View style={StyleSheet.absoluteFillObject}>
//             {cards.slice(0, 3).map((card, index) => (
//               <CardComponent 
//                 key={card.id} 
//                 card={card} 
//                 index={index} 
//                 totalCards={Math.min(cards.length, 3)}
//                 activeIndex={activeIndex}
//                 translateX={translateX}
//               />
//             )).reverse()}
//           </View>
//         </GestureDetector>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   cardContainer: {
//     marginTop:100,
//     marginLeft:50,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   card: {
//     width: 250,
//     height: 300,
//     borderRadius: 10,
//     backgroundColor: 'white',
//     position: 'absolute',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//   cardInfo: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//   },
//   cardName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//   },
// });

// export default HorizontalSwipeCardStack;