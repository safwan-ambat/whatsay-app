import React, { useRef, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, Dimensions, SafeAreaView, ImageStyle, ViewStyle, TouchableOpacity,Animated } from 'react-native';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { useNewsItemAnimations } from '@/hooks/useAnimations';
import { NewsItem, ExpandedNewsItemProps } from '@/types';
import CommentSectionModal from '@/components/comment/commentSectionModal';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Reanimated, {
} from 'react-native-reanimated';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledLinearGradient = styled(LinearGradient);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');



const ExpandedNewsItem: React.FC<ExpandedNewsItemProps> = ({ items, initialIndex, isVisible, onClose }) => {
  const flatListRef = useRef<FlatList<NewsItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  
  const { animatedValues, closeModal } = useNewsItemAnimations(isCommentModalVisible, onClose);





  const renderItem = useCallback(({ item }: { item: NewsItem }) => {
    const imageWrapperStyle: ViewStyle = {
      height: screenHeight * 0.37,
      marginTop: 10,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      borderBottomRightRadius: isCommentModalVisible ? 20 : 0,
      borderBottomLeftRadius: isCommentModalVisible ? 20 : 0,
      alignSelf: 'center',
      overflow: 'hidden',
      shadowColor: "green",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5.84,
      zIndex:50,
    };

    const imageStyle: ImageStyle = {
      width: '100%',
      height: '100%',
    };

    const gradientStyle: ViewStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    };

    return (
      
      <Animated.View style={[
        { width: screenWidth,backgroundColor:'white', transform: [{ scale: animatedValues.scale }] }
      ]}>
        <Animated.View style={[
          imageWrapperStyle,
          {
            width: animatedValues.imageSize.interpolate({
              inputRange: [54, 100],
              outputRange: ['54%', '100%'],
            }),
          }
        ]}>
          <StyledImage source={item.image} style={imageStyle} resizeMode="cover" />
          <Animated.View style={[gradientStyle, { opacity: animatedValues.gradientOpacity }]}>
            <StyledLinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={{ flex: 1 }}
            />
          </Animated.View>

          <Animated.View style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            transform: [{ translateY: animatedValues.titlePosition }],
          }}>
            {isCommentModalVisible && (
              <StyledText className="text-3xl font-domine text-white">{item.title}</StyledText>
            )}
          </Animated.View>
        </Animated.View>
        <Animated.View style={{
          opacity: animatedValues.contentOpacity,
          transform: [{ 
            translateY: animatedValues.contentOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })
          }],
        }}>
          <StyledView className="p-4">
            <StyledText className="text-3xl font-domine mb-2">{item.title}</StyledText>
            <StyledText className="text-base mb-4">{item.text}</StyledText>
            <StyledView className="mb-4 bg-green-100 text-green-800 rounded-full mr-auto border border-green-300">
              <StyledText className="text-sm px-4 py-1 rounded-full inline-block">
                {/* {item.category} */}
              </StyledText>
            </StyledView>
          </StyledView>
        </Animated.View>


{/* commentSection */}
        <CommentSectionModal
          postId={item.id.toString()}
          isVisible={isCommentModalVisible}
          onClose={() => setIsCommentModalVisible(false)}
        />

          {!isCommentModalVisible && <TouchableOpacity onPress={() => setIsCommentModalVisible(true)}
              className="absolute bottom-4 self-center bg-[#F7F7F7] rounded-full px-[20px] py-[8px]">
                <AntDesign name="up" size={12} color="#9DA2A9" />
          </TouchableOpacity>}
      </Animated.View>
      
    );
  }, [isCommentModalVisible, animatedValues]);
    



  const getItemLayout = useCallback((_: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  }), []);
  
  const handleScroll = useCallback((event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(slideIndex);
  }, []);



  return (
        <Reanimated.View style={[
          {
            flex: 1,
            marginTop:40
            
          },
          // animatedStyle
        ]}>
          
            <StyledView style={{ flex: 1,backgroundColor: 'white' }}>             
              <FlatList
                ref={flatListRef}
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                onMomentumScrollEnd={handleScroll}
                initialScrollIndex={initialIndex}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={screenWidth}
                snapToAlignment="center"
              />
            </StyledView>
         
        </Reanimated.View>
  );
};

export default gestureHandlerRootHOC(ExpandedNewsItem);