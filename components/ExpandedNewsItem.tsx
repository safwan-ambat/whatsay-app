// import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
// import { View, Text, Image, Modal, FlatList, Dimensions, SafeAreaView, ImageStyle, ViewStyle, Animated, Easing, PanResponder, PanResponderGestureState } from 'react-native';
// import { styled } from 'nativewind';
// import PullUpCommentSection from '@/components/CommentSection';
// import { LinearGradient } from 'expo-linear-gradient';

// const StyledView = styled(View);
// const StyledText = styled(Text);
// const StyledImage = styled(Image);
// const StyledLinearGradient = styled(LinearGradient);

// interface NewsItem {
//   id: number;
//   title: string;
//   text: string;
//   image: any;
//   category: string;
// }

// interface Comment {
//   id: string;
//   author: string;
//   content: string;
//   timestamp: string;
// }

// interface ExpandedNewsItemProps {
//   items: NewsItem[];
//   initialIndex: number;
//   isVisible: boolean;
//   onClose: () => void;
// }

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const ExpandedNewsItem: React.FC<ExpandedNewsItemProps> = ({ items, initialIndex, isVisible, onClose }) => {
//   const flatListRef = useRef<FlatList<NewsItem>>(null);
//   const [currentIndex, setCurrentIndex] = useState(initialIndex);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  
//   const animatedValues = useMemo(() => ({
//     imageSize: new Animated.Value(100),
//     gradientOpacity: new Animated.Value(0),
//     scale: new Animated.Value(1),
//     titlePosition: new Animated.Value(1),
//     contentOpacity: new Animated.Value(1),
//     modalY: new Animated.Value(0),
//   }), []);

//   const panResponder = useMemo(() => PanResponder.create({
//     onMoveShouldSetPanResponder: (_, { dy, dx }) => {
//       return Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10 && !isCommentSectionOpen;
//     },
//     onPanResponderMove: (_, { dy }) => {
//       if (dy > 0 && !isCommentSectionOpen) {
//         animatedValues.modalY.setValue(dy);
//       }
//     },
//     onPanResponderRelease: (_, gestureState) => {
//       if (!isCommentSectionOpen) {
//         handlePanResponderRelease(gestureState);
//       }
//     },
//   }), [isCommentSectionOpen, animatedValues.modalY]);

//   const handlePanResponderRelease = useCallback((gestureState: PanResponderGestureState) => {
//     if (!isCommentSectionOpen) {
//       if (gestureState.dy > 100 || gestureState.vy > 0.5) {
//         closeModal();
//       } else {
//         Animated.spring(animatedValues.modalY, {
//           toValue: 0,
//           useNativeDriver: true,
//         }).start();
//       }
//     }
//   }, [isCommentSectionOpen, animatedValues.modalY]);

//   const closeModal = useCallback(() => {
//     if (!isCommentSectionOpen) {
//       Animated.timing(animatedValues.modalY, {
//         toValue: screenHeight,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => {
//         onClose();
//         animatedValues.modalY.setValue(0);
//       });
//     } else {
//       setIsCommentSectionOpen(false);
//     }
//   }, [isCommentSectionOpen, animatedValues.modalY, onClose]);

//   useEffect(() => {
//     if (isVisible && flatListRef.current) {
//       flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
//     }
//   }, [isVisible, initialIndex]);

//   useEffect(() => {
//     loadComments(items[currentIndex].id);
//   }, [currentIndex, items]);

//   useEffect(() => {
//     const animations = [
//       Animated.timing(animatedValues.imageSize, {
//         toValue: isCommentSectionOpen ? 94 : 100,
//         duration: 500,
//         useNativeDriver: false,
//         easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//       }),
//       Animated.timing(animatedValues.gradientOpacity, {
//         toValue: isCommentSectionOpen ? 1 : 0,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//       Animated.sequence([
//         Animated.timing(animatedValues.scale, {
//           toValue: 0.95,
//           duration: 150,
//           useNativeDriver: true,
//           easing: Easing.out(Easing.cubic),
//         }),
//         Animated.timing(animatedValues.scale, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: true,
//           easing: Easing.elastic(1.2),
//         }),
//       ]),
//       Animated.timing(animatedValues.titlePosition, {
//         toValue: !isCommentSectionOpen ? 200 : 0,
//         duration: 100,
//         useNativeDriver: true,
//         easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//       }),
//       Animated.timing(animatedValues.contentOpacity, {
//         toValue: isCommentSectionOpen ? 0 : 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ];

//     Animated.parallel(animations).start();
//   }, [isCommentSectionOpen, animatedValues]);

//   const loadComments = useCallback((newsId: number) => {
//     // Simulated API call, replace with actual API call
//     setComments([
//       { id: '1', author: 'Akash', content: 'Great article!', timestamp: '2 hours ago' },
//       { id: '2', author: 'Jibi', content: 'Very informative.', timestamp: '1 hour ago' },
//     ]);
//   }, []);

//   const renderItem = useCallback(({ item }: { item: NewsItem }) => {
//     const imageWrapperStyle: ViewStyle = {
//       height: 346,
//       marginTop: 10,
//       borderTopRightRadius:isCommentSectionOpen ? 20:20,
//       borderTopLeftRadius:isCommentSectionOpen ? 20:20,
//       borderBottomRightRadius: isCommentSectionOpen ? 20:0,
//       borderBottomLeftRadius: isCommentSectionOpen ? 20:0,
//       alignSelf: 'center',
//       overflow: 'hidden',
//       shadowColor: "green",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.4,
//       shadowRadius: 5.84,
//     };

//     const imageStyle: ImageStyle = {
//       width: '100%',
//       height: '100%',
//     };

//     const gradientStyle: ViewStyle = {
//       position: 'absolute',
//       left: 0,
//       right: 0,
//       top: 0,
//       height: '100%',
//     };

//     return (
//       <Animated.View style={[
//         { width: screenWidth, transform: [{ scale: animatedValues.scale }] }
//       ]}>
//         <Animated.View style={[
//           imageWrapperStyle,
//           {
//             width: animatedValues.imageSize.interpolate({
//               inputRange: [54, 100],
//               outputRange: ['54%', '100%'],
//             }),
//           }
//         ]}>
//           <StyledImage source={item.image} style={imageStyle} resizeMode="cover" />
//           <Animated.View style={[gradientStyle, { opacity: animatedValues.gradientOpacity }]}>
//             <StyledLinearGradient
//               colors={['transparent', 'rgba(0,0,0,0.8)']}
//               style={{ flex: 1 }}
//             />
//           </Animated.View>
//           <Animated.View style={{
//             position: 'absolute',
//             bottom: 20,
//             left: 20,
//             right: 20,
//             transform: [{ translateY: animatedValues.titlePosition }],
//           }}>
//             <StyledText className="text-3xl font-domine text-white">{item.title}</StyledText>
//           </Animated.View>
//         </Animated.View>
//         <Animated.View style={{
//           opacity: animatedValues.contentOpacity,
//           transform: [{ 
//             translateY: animatedValues.contentOpacity.interpolate({
//               inputRange: [0, 1],
//               outputRange: [50, 0],
//             })
//           }],
//         }}>
//           <StyledView className="p-4">
//             <StyledText className="text-3xl font-domine font-bold mb-2">{item.title}</StyledText>
//             <StyledText className="text-base mb-4">{item.text}</StyledText>
//             <StyledView className="mb-4 bg-green-100 text-green-800 rounded-full mr-auto border border-green-300">
//               <StyledText className="text-sm px-4 py-1 rounded-full inline-block">
//                 sample text
//               </StyledText>
//             </StyledView>
//           </StyledView>
//         </Animated.View>
//         <StyledView style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: screenHeight * 0.4 }}>
//           <PullUpCommentSection
//             comments={comments}
//             onAddComment={handleAddComment}
//             isOpen={isCommentSectionOpen}
//             setIsOpen={setIsCommentSectionOpen}
//           />
//         </StyledView>
//       </Animated.View>
//     );
//   }, [isCommentSectionOpen, comments, animatedValues]);

//   const getItemLayout = useCallback((_: any, index: number) => ({
//     length: screenWidth,
//     offset: screenWidth * index,
//     index,
//   }), []);
  
//   const handleScroll = useCallback((event: any) => {
//     const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
//     setCurrentIndex(slideIndex);
//   }, []);

//   const handleAddComment = useCallback((content: string) => {
//     const newComment: Comment = {
//       id: Date.now().toString(),
//       author: 'Current User', // Replace with actual user name
//       content,
//       timestamp: 'Just now',
//     };
//     setComments(prevComments => [newComment, ...prevComments]);
//     // You might want to send this new comment to your backend here
//   }, []);

//   return (
//     <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={closeModal}>
//       <Animated.View 
//         style={{
//           flex: 1,
//           transform: [{ translateY: animatedValues.modalY }],
//         }}
//         {...panResponder.panHandlers}
//       >
//         <SafeAreaView className="flex-1 bg-white">
//           <StyledView className="flex-1">
//             <FlatList
//               ref={flatListRef}
//               data={items}
//               renderItem={renderItem}
//               keyExtractor={(item) => item.id.toString()}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               getItemLayout={getItemLayout}
//               onMomentumScrollEnd={handleScroll}
//               initialScrollIndex={initialIndex}
//               scrollEventThrottle={16}
//               decelerationRate="fast"
//               snapToInterval={screenWidth}
//               snapToAlignment="center"
//             />
//           </StyledView>
//         </SafeAreaView>
//       </Animated.View>
//     </Modal>
//   );
// };

// export default ExpandedNewsItem;