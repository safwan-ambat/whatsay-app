import { useNewsItemAnimations } from '@/hooks/useAnimations';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Animated } from 'react-native';
import { ImageStyle } from 'react-native';
import { Platform, ViewStyle } from 'react-native';
import { FlatList } from 'react-native';
import { View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import CommentSectionModal from './comment/commentSectionModal';

const StyledView = styled(View);
const StyledImage = styled(Image);

const ExpandNewsItem = ({ items, initialArticleId, isVisible, onClose }: any) => {

    const findArticleIndex = items.findIndex((item: any) => item.id == initialArticleId);

    const flatListRef = useRef<any>(null);

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const { animatedValues, closeModal } = useNewsItemAnimations(isCommentModalVisible, onClose);

    const [activeArticle, setActiveArticle] = useState(initialArticleId);

    const renderItem = useCallback(({ item }: { item: any }) => {

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
            <Animated.View style={[
                { width: screenWidth, backgroundColor: isCommentModalVisible ? '#F3F4F6' : 'white', transform: [{ scale: animatedValues.scale }] }
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
                    <StyledImage source={{ uri: item.image_url }} style={imageStyle} resizeMode="cover" />
                    <Animated.View style={[gradientStyle, { opacity: animatedValues.gradientOpacity }]}>
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={{ flex: 1 }}
                        />
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
                        <Text className="font-geist font-light mb-4 text-[16px]">{item.summary}</Text>
                        <StyledView className="mb-4 bg-green-100 text-green-800 rounded-full mr-auto border border-green-300">
                            <Text className="text-sm px-4 py-1 rounded-full inline-block">
                                sports
                            </Text>
                        </StyledView>
                    </StyledView>
                </Animated.View>

                {!isCommentModalVisible && (
                    <TouchableOpacity
                        onPress={() => setIsCommentModalVisible(true)}
                        className="absolute bottom-[40px] self-center bg-[#F7F7F7] rounded-full px-[20px] py-[8px]"
                    >
                        <AntDesign name="up" size={12} color="#9DA2A9" />
                    </TouchableOpacity>
                )}
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
        setActiveArticle(slideIndex);
    }, []);

    return (
        <Reanimated.View style={[{ flex: 1, marginTop: 50 }]}>
            <StyledView style={{ flex: 1, backgroundColor: 'white' }}>
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
                    initialScrollIndex={findArticleIndex}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    snapToInterval={screenWidth}
                    snapToAlignment='center'
                />
            </StyledView>

            {/* CommentSectionModal */}
            <CommentSectionModal
                postId={activeArticle}
                isVisible={isCommentModalVisible}
                onClose={() => setIsCommentModalVisible(false)}
            />
        </Reanimated.View>
    )
}

export default ExpandNewsItem