import React, { useCallback, useEffect, useState } from 'react'
import { Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native'
import curatedIcon from '@/assets/categoryIcons/curatedIcon.webp';
import internationalIcon from '@/assets/categoryIcons/InternationalIcon.webp';
import { CategoryType } from '@/types/CategoryTypes';
import { Text } from 'react-native';
import images from "@/constants/news-images";
import { Card } from '../CardAnimation';
import { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getAllArticlesByCategories } from '@/api/apiArticles';

type CategoryIconKey = 'Curated for you' | 'International News' | string;

const categoryIcons: Record<CategoryIconKey, any> = {
    'Curated for you': curatedIcon,
    'Latest News': internationalIcon,
    // Add more mappings as needed
};

const CategoryArticles = ({ category }: { category: CategoryType }) => {

    const [articles, setArticles] = useState<any[]>([])

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

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
                slug: itemId.toString(),  // This represents `newsId`
                categoryId: categoryId.toString(),
            }
        });
    }, [router]);

    useEffect(() => {
        (async () => {
            try {
                const response = await getAllArticlesByCategories(category.id as string);
                setArticles(response)
            } catch (error) {
                console.log("error", error);
            }
        })()
    }, [])

    return (
        <View className='border-b-2 border-[#F3F4F6] pb-[300px] pt-5'>
            {/* Category Title */}
            <View className='flex-row items-center pl-[16px]'>
                <Image
                    source={categoryIcons[category.name as CategoryIconKey]}
                    className='w-[24px] h-[24px] mr-2'
                    resizeMode='contain' />
                <Text className='text-xl font-domine'>{category.name}</Text>
            </View>
            <View style={[styles.cardContainer, , { width: SCREEN_WIDTH }]}>
                {articles.slice(0, 3).map((item, itemIndex) => {
                    return (
                        <Card
                            key={item.id}
                            card={{
                                id: item.id,
                                title: item.title,
                                image: item.image_url,
                            }}
                            index={itemIndex}
                            totalCards={Math.min(articles.length, 3)}
                            activeIndex={activeIndex}
                            translateX={translateX}
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

export default CategoryArticles

const styles = StyleSheet.create({
    cardContainer: {
        height: Platform.OS === 'ios' ? 180 : 260,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        overflow: 'visible',
        paddingBottom: Platform.OS === 'ios' ? 20 : 60,
    },
});