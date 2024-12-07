import { useNewsItemAnimations } from '@/hooks/useAnimations';
import { useCombinedSwipe } from '@/hooks/useCombined';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    Animated, 
    FlatList,
    Dimensions,
    Platform
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import CommentSectionModal from './comment/commentSectionModal';
import { getAllCategories } from '@/api/apiCategories';
import { CategoryType } from '@/types/CategoryTypes';
import {
    SCREEN_DIMENSIONS,
    IMAGE_WRAPPER_STYLE,
    IMAGE_STYLE,
    GRADIENT_STYLE,
    CATEGORY_STYLES,
    DEFAULT_CATEGORY_STYLE
} from '@/constants/expandedScreenData';

const StyledView = styled(View);
const StyledImage = styled(Image);

const getCategoryStyleClasses = (categoryName: string) => {
    const styles = CATEGORY_STYLES[categoryName] || DEFAULT_CATEGORY_STYLE;
    return {
        container: `mb-4 mr-auto border rounded-full`,
        text: `text-sm px-4 py-1 rounded-full inline-block`,
        style: {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
        },
        textStyle: {
            color: styles.textColor,
        }
    };
};

interface ExpandNewsItemProps {
    items: any[];
    initialArticleId: number | string;
    isVisible: boolean;
    onClose: () => void;
}

const ExpandNewsItem: React.FC<ExpandNewsItemProps> = ({ 
    items, 
    initialArticleId, 
    isVisible, 
    onClose 
}) => {
    const findArticleIndex = items.findIndex((item: any) => item.id == initialArticleId);
    const flatListRef = useRef<FlatList>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const { animatedValues } = useNewsItemAnimations(isCommentModalVisible, onClose); // Removed closeModal from destructuring
    const [activeArticle, setActiveArticle] = useState(initialArticleId);
    const currentIndexRef = useRef(findArticleIndex);

    const handleCommentModalClose = () => {
        setIsCommentModalVisible(false);
        // Don't call onClose here as it would close the main modal
    };

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

    const { panResponder, scrollEnabled, animatedStyle } = useCombinedSwipe({
        data: items,
        currentIndex: currentIndexRef.current,
        onSwipeLeft: (index) => {
            if (flatListRef.current && !isCommentModalVisible) {
                flatListRef.current.scrollToIndex({
                    index,
                    animated: true
                });
            }
        },
        onSwipeRight: (index) => {
            if (flatListRef.current && !isCommentModalVisible) {
                flatListRef.current.scrollToIndex({
                    index,
                    animated: true
                });
            }
        },
        onSwipeUp: () => {
            if (!isCommentModalVisible) {
                setIsCommentModalVisible(true);
            }
        },
        onSwipeDown: () => {
            if (!isCommentModalVisible && onClose) {
                onClose();
            }
        },
        isCommentModalVisible
    });

    const handleScroll = useCallback((event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_DIMENSIONS.width);
        currentIndexRef.current = slideIndex;
        setActiveArticle(items[slideIndex].id);
    }, [items]);

    const renderScreen = ({ item }: { item: any }) => {
        const category = categories.find((cat: CategoryType) => cat.id === item.category_id);
        const imageWrapperStyle = {
            ...IMAGE_WRAPPER_STYLE,
            borderBottomRightRadius: isCommentModalVisible ? 20 : 0,
            borderBottomLeftRadius: isCommentModalVisible ? 20 : 0,
        };

        return (
            <Animated.View
                style={[{ 
                    width: SCREEN_DIMENSIONS.width, 
                    backgroundColor: isCommentModalVisible ? '#F3F4F6' : 'white', 
                    transform: [{ scale: animatedValues.scale }] 
                }]}
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
                    <StyledImage 
                        source={{ uri: item.image_url }} 
                        style={IMAGE_STYLE} 
                        resizeMode="cover" 
                    />
                    <Animated.View style={[
                        GRADIENT_STYLE, 
                        { opacity: animatedValues.gradientOpacity }
                    ]}>
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
                            <Text className="text-[22px] font-domine text-white">
                                {item.title}
                            </Text>
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
                        {isCommentModalVisible && (
                            <View className='h-[4px] w-[24px] rounded-full bg-[#FFFFFF]/20' />
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
                    <StyledView className="p-[16px]">
                        <Text className="text-[20px] font-domine mb-[12px]">
                            {item.title}
                        </Text>
                        <Text className="font-geist font-light mb-4 text-[16px] leading-6">
                            {item.summary}
                        </Text>

                        {category && (
                            <View
                                className={getCategoryStyleClasses(category.name).container}
                                style={getCategoryStyleClasses(category.name).style}
                            >
                                <Text
                                    className={getCategoryStyleClasses(category.name).text}
                                    style={getCategoryStyleClasses(category.name).textStyle}
                                >
                                    {category.name}
                                </Text>
                            </View>
                        )}
                    </StyledView>
                </Animated.View>

                {!isCommentModalVisible && (
                    <View className="absolute bottom-[40px] self-center bg-[#F7F7F7] rounded-full px-[20px] py-[8px]">
                        <AntDesign name="up" size={12} color="#9DA2A9" />
                    </View>
                )}
            </Animated.View>
        );
    };

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: SCREEN_DIMENSIONS.width,
        offset: SCREEN_DIMENSIONS.width * index,
        index,
    }), []);

    return (
        <Reanimated.View style={[{ flex: 1, marginTop: 50 }]}>
            <Animated.View style={[
                { flex: 1, backgroundColor: 'white' },
                animatedStyle
            ]}>
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
                    scrollEnabled={scrollEnabled && !isCommentModalVisible}
                    decelerationRate="fast"
                    snapToInterval={SCREEN_DIMENSIONS.width}
                    snapToAlignment='center'
                />
            </Animated.View>
            <CommentSectionModal
                postId={activeArticle.toString()}
                isVisible={isCommentModalVisible}
                onClose={() => setIsCommentModalVisible(false)}
            />
        </Reanimated.View>
    );
};

export default ExpandNewsItem;