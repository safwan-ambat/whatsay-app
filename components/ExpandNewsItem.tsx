import { useNewsItemAnimations } from '@/hooks/useAnimations';
import { useSwipeGesture } from '@/hooks/useSwipeUp';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, PanResponder, Text, TouchableOpacity, Image, Animated, ImageStyle, Platform, ViewStyle, FlatList, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import CommentSectionModal from './comment/commentSectionModal';
import { getAllCategories } from '@/api/apiCategories';
import { CategoryType } from '@/types/CategoryTypes';

type ColorScheme = {
    background: string;
    text: string;
    border: string;
  };

  const getCategoryColors = (categoryName: string): ColorScheme => {
    const colorMap: { [key: string]: ColorScheme } = {
        'Automobile': {
            background: 'bg-[#EEF3FA]',
            text: 'text-[#5584CB]',
            border: 'border-[#CFDDF1]'
          },
          'Breaking news': {
            background: 'bg-[#FAEEF0]',
            text: 'text-[#CB556D]',
            border: 'border-[#F1CFD6]'
          },
          'Business': {
            background: 'bg-[#F3EEFA]',
            text: 'text-[#8655CB]',
            border: 'border-[#DDCFF1]'
          },
          'Curated for you': {
            background: 'bg-[#FAEEF9]',
            text: 'text-[#CB55BF]',
            border: 'border-[#F1CFED]'
          },
          'Entertainment': {
            background: 'bg-[#FAF4EE]',
            text: 'text-[#CB9455]',
            border: 'border-[#F1E1CF]'
          },
          'Health': {
            background: 'bg-[#EEFAF6]',
            text: 'text-[#55CBA4]',
            border: 'border-[#CFF1E6]'
          },
          'International News': {
            background: 'bg-[#EFEEFA]',
            text: 'text-[#6155CB]',
            border: 'border-[#D2CFF1]'
          },
          'Lifestyle': {
            background: 'bg-[#FAF1EE]',
            text: 'text-[#CB7155]',
            border: 'border-[#F1D7CF]'
          },
          'Opinions': {
            background: 'bg-[#F4EEFA]',
            text: 'text-[#8E55CB]',
            border: 'border-[#DFCFF1]'
          },
          'Politics': {
            background: 'bg-[#EEF1FA]',
            text: 'text-[#5573CB]',
            border: 'border-[#CFD7F1]'
          },
          'Science': {
            background: 'bg-[#EEF3FA]',
            text: 'text-[#5584CB]',
            border: 'border-[#CFDDF1]'
          },
          'Sports': {
            background: 'bg-[#EEFAF3]',
            text: 'text-[#55CB84]',
            border: 'border-[#CFF1DD]'
          },
          'Technology': {
            background: 'bg-[#F4EEFA]',
            text: 'text-[#8C55CB]',
            border: 'border-[#DFCFF1]'
          },
          'World': {
            background: 'bg-[#FAEEF5]',
            text: 'text-[#CB559C]',
            border: 'border-[#F1CFE3]'
          },
          'Travel': {
            background: 'bg-[#EEF7FA]',
            text: 'text-[#55ACCB]',
            border: 'border-[#CFE8F1]'
          },
          'Startup': {
            background: 'bg-[#EEEEFA]',
            text: 'text-[#5557CB]',
            border: 'border-[#CFD0F1]'
          }
    };
  
    // Default color scheme if category is not found
    const defaultColors: ColorScheme = {
      background: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300'
    };
  
    return colorMap[categoryName] || defaultColors;
  };

const StyledView = styled(View);
const StyledImage = styled(Image);

const ExpandNewsItem = ({ items, initialArticleId, isVisible, onClose }: any) => {

    const findArticleIndex = items.findIndex((item: any) => item.id == initialArticleId);

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const flatListRef = useRef<any>(null);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const { animatedValues, closeModal } = useNewsItemAnimations(isCommentModalVisible, onClose);
    const [activeArticle, setActiveArticle] = useState(initialArticleId);

    useEffect(() => {
        (async () => {
            try {
                const apiRes = await getAllCategories();
                if (apiRes) {
                    setCategories(apiRes);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        })();
    }, []);

    const panResponder = useSwipeGesture({
        onSwipeUp: () => setIsCommentModalVisible(true),
        isCommentModalVisible  // Pass the modal state
      });

    const renderScreen = ({ item }: any) => {
        const category = categories.find((cat: CategoryType) => cat.id === item.category_id);
        
        const imageWrapperStyle: ViewStyle = {
            height: Platform.OS === 'ios' ? screenHeight * 0.42 : screenHeight * 0.46,
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
            zIndex: 50,
            pointerEvents: "none",
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
            <Animated.View 
                style={[{ width: screenWidth, backgroundColor: isCommentModalVisible ? '#F3F4F6' : 'white', transform: [{ scale: animatedValues.scale }] }]}
                {...panResponder.panHandlers}
            >
                <Animated.View style={[
                    imageWrapperStyle,
                    {
                        width: animatedValues.imageSize.interpolate({
                            inputRange: [54, 100],
                            outputRange: ['54%', '100%'],
                        }),
                    }
                ]}>
                    <StyledImage source={{ uri: item.image_url }} style={imageStyle} resizeMode="cover" />
                    <Animated.View style={[gradientStyle, { opacity: animatedValues.gradientOpacity }]}>
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={{ flex: 1 }} />
                    </Animated.View>

                    <Animated.View style={{
                        position: 'absolute',
                        bottom: 32,
                        left: 20,
                        right: 20,
                        transform: [{ translateY: animatedValues.titlePosition }],
                    }}>
                        {isCommentModalVisible && (
                            <Text className="text-[22px] font-domine text-white">{item.title}</Text>
                        )}
                    </Animated.View>
                    <Animated.View style={{
                        position: 'absolute',
                        bottom: 12,
                        alignSelf: 'center',
                        transform: [{
                            translateY: animatedValues.dragIndicator
                        }],
                    }}>
                        {isCommentModalVisible &&
                            <View className='h-[4px] w-[24px] rounded-full bg-[#FFFFFF]/20' />}
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
                    <StyledView className="p-[16px]">
                        
                        <Text className="text-[20px] font-domine mb-[12px]">{item.title}</Text>
                        <Text className="font-geist font-light mb-4 text-[16px] leading-6">{item.summary}</Text>
                        
                        {category && (
                            <StyledView className={`mb-4 mr-auto border rounded-full ${getCategoryColors(category.name).background} ${getCategoryColors(category.name).border}`}>
                                <Text className={`text-sm px-4 py-1 rounded-full inline-block ${getCategoryColors(category.name).text}`}>
                                {category.name}
                                </Text>
                            </StyledView>
                            )}
                        </StyledView>
                    
                </Animated.View>

                {/* {!isCommentModalVisible && (
                    <TouchableOpacity
                        onPress={() => setIsCommentModalVisible(true)}
                        className="absolute bottom-[40px] self-center bg-[#F7F7F7] rounded-full px-[20px] py-[8px]"
                    >
                        <AntDesign name="up" size={12} color="#9DA2A9" />
                    </TouchableOpacity>
                )} */}
                {!isCommentModalVisible && (
                    <View
                       
                        className="absolute bottom-[40px] self-center bg-[#F7F7F7] rounded-full px-[20px] py-[8px]"
                    >
                        <AntDesign name="up" size={12} color="#9DA2A9" />
                    </View>
                )}

            </Animated.View>
        );
    }

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
    }), []);

    const handleScroll = useCallback((event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setActiveArticle(slideIndex);
    }, []);

    return (
        <Reanimated.View style={[{ flex: 1, marginTop: 50 }]}>
            <StyledView style={{ flex: 1, backgroundColor: 'white' }}>
                <FlatList
                    ref={flatListRef}
                    data={items}
                    renderItem={renderScreen}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={getItemLayout}
                    onMomentumScrollEnd={handleScroll}
                    initialScrollIndex={findArticleIndex}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={screenWidth}
                    snapToAlignment='center'
                />
            </StyledView>

            <CommentSectionModal
                postId={activeArticle}
                isVisible={isCommentModalVisible}
                onClose={() => setIsCommentModalVisible(false)}
            />
        </Reanimated.View>
    )
}

export default ExpandNewsItem;
