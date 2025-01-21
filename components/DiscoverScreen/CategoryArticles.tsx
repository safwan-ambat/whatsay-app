import React, { useCallback, useEffect, useState } from 'react'
import { Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native'
import { CategoryType } from '@/types/CategoryTypes';
import { Text } from 'react-native';
import { Card } from '../CardAnimation';
import { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getAllArticlesByCategories } from '@/api/apiArticles';
// import {
//     automobile, breakingNews, business, curatedForYou, entertainment, health,
//     internationalNews, lifestyle, opinions, politics, science, sports, startup, technology,
//     travel, world, finance
// } from '@/assets';
import {getLast48HoursRange } from '@/utils/DataAndTimeHelper';

type CategoryIconKey = 'categoryKey' | string;

// const categoryIcons: Record<CategoryIconKey, any> = {
//     'Automobile': automobile,
//     'Breaking news': breakingNews,
//     'Business': business,
//     'Curated for you': curatedForYou,
//     'Entertainment': entertainment,
//     'Health': health,
//     'International News': internationalNews,
//     'Lifestyle': lifestyle,
//     'Opinions': opinions,
//     'Politics': politics,
//     'Science': science,
//     'Sports': sports,
//     'Technology': technology,
//     'World': world,
//     'Travel': travel,
//     'Startup': startup,
//     'Finance': finance,
// };

const CategoryArticles = ({ category }: { category: CategoryType }) => {
    const [articles, setArticles] = useState<any[]>([])
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const isTablet = SCREEN_WIDTH >= 768;

    const activeIndex = useSharedValue(0);
    const translateX = useSharedValue(0);
    const router = useRouter();

    const handleSwipe = useCallback((swipedArticle: any, direction: 'left' | 'right') => {
        try {
            setArticles((prevData): any => {
                const newData = prevData.filter((article: any) => article.id !== swipedArticle.id);
                newData.push(swipedArticle);
                return newData;
            });
        } catch (error) {
            console.log("error: ", error);
        }
    }, []);

    const handleItemPress = useCallback((categoryId: any, itemId: number) => {
        router.push({
            pathname: '/(news)/[slug]',
            params: {
                slug: itemId.toString(),
                categoryId: categoryId.toString(),
            }
        });
    }, [router]);

    useEffect(() => {
        (async () => {
            const { from, to } = getLast48HoursRange();
            const categoryId = category.id as string;
            try {
                const response = await getAllArticlesByCategories(categoryId, from, to);
                setArticles(response)
            } catch (error) {
                console.log("error", error);
            }
        })()
    }, []);

    // Calculate stack dimensions based on device type
    const getStackDimensions = () => {
        if (isTablet) {
            return {
                containerHeight: 1020,
                stackPadding: 560,
                containerPadding: 500
            };
        }
        return {
            containerHeight: Platform.OS === 'ios' ? 388 : 260,
            stackPadding: Platform.OS === 'ios' ? 10 : 10,
            containerPadding: 0
        };
    };

    const { containerHeight, stackPadding, containerPadding } = getStackDimensions();
    const visibleArticles = articles.slice(0, isTablet ? 4 : 3);
    const cardContainerPaddingTop = visibleArticles.length === 1 ? 20 : 42;
    const cardContainerMarginBottom = visibleArticles.length === 1 ? 20 : 40;

    return (
        <View className={`pb-[${containerPadding}px] pt-5 border-b-2 border-[#F3F4F6]`}>
            <View className={`flex-row items-center ${isTablet ? 'pl-[32px]' : 'pl-[16px]'}`}>
                <Image
                    source={{ uri: category?.icon_url }}
                    // source={categoryIcons[category.name as CategoryIconKey]}
                    className={`${isTablet ? 'w-[36px] h-[36px]' : 'w-[28px] h-[28px]'} mr-[8px]`}
                    resizeMode='contain' />
                <Text className={`font-domine ${isTablet ? 'text-[24px]' : 'text-[20px]'}`}>
                    {category.name}
                </Text>
            </View>
            <View style={[
                styles.cardContainer,
                {
                    width: SCREEN_WIDTH,
                    height: containerHeight,
                    // paddingBottom: stackPadding,
                    paddingTop: cardContainerPaddingTop,
                    marginBottom: cardContainerMarginBottom,
                }
            ]}>
                {visibleArticles.map((item, itemIndex) => {
                    console.log("category.index",category);
                    
                    return (
                        <Card
                            key={item.id}
                            card={{
                                id: item.id,
                                title: item.title,
                                image: item.image_url,
                            }}
                            index={itemIndex}
                            totalCards={visibleArticles.length}
                            activeIndex={activeIndex}
                            translateX={translateX}
                            categoryIndex={category.index}
                            onSwipe={(direction) => {
                                handleSwipe(item, direction);
                                translateX.value = 0;
                                activeIndex.value = 0;
                            }}
                            onPress={() => handleItemPress(category.id, item.id)}
                        />
                    )
                }).reverse()}
            </View>
        </View>
    )
}

export default CategoryArticles;

const styles = StyleSheet.create({
    cardContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'visible',
    },
});