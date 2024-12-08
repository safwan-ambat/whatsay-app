import React, { useCallback, useEffect, useState } from 'react'
import { Image, Platform, StyleSheet, useWindowDimensions, View } from 'react-native'
import { CategoryType } from '@/types/CategoryTypes';
import { Text } from 'react-native';
import { Card } from '../CardAnimation';
import { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getAllArticlesByCategories } from '@/api/apiArticles';
import {
    automobile,breakingNews,business,curatedForYou,entertainment,health,
    internationalNews,lifestyle,opinions,politics,science,sports,startup,technology,
    travel,
    world
} from '@/assets';
import useLocation from '@/hooks/useLocation';

type CategoryIconKey = 'categoryKey' | string;

const categoryIcons: Record<CategoryIconKey, any> = {
    'Automobile': automobile,
    'Breaking news': breakingNews,
    'Business': business,
    'Curated for you': curatedForYou,
    'Entertainment': entertainment,
    'Health': health,
    'International News': internationalNews,
    'Lifestyle': lifestyle,
    'Opinions': opinions,
    'Politics': politics,
    'Science': science,
    'Sports': sports,
    'Technology': technology,
    'World': world,
    'Travel': travel,
    'Startup': startup,
};

const CategoryArticles = ({ category }: { category: CategoryType }) => {

    const [articles, setArticles] = useState<any[]>([])

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

    const {latitude, longitude, errorMsg, location} = useLocation();

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
                    className='w-[28px] h-[28px] mr-[8px]'
                    resizeMode='contain' />
                <Text className='text-[20px] font-domine'>{category.name}</Text>
            </View>
            <View className='flex flex-col gap-1'>
                <Text>Longitude: {longitude}</Text>
                <Text>Latitude: {latitude}</Text>
                <Text>city: {location[0]?.city}</Text>
                <Text>country: {location[0]?.country}</Text>
                <Text>district: {location[0]?.district}</Text>
                <Text>isoCountryCode: {location[0]?.isoCountryCode}</Text>
                <Text>name: {location[0]?.name}</Text>
                <Text>postalCode: {location[0]?.postalCode}</Text>
                <Text>region: {location[0]?.region}</Text>
                <Text>street: {location[0]?.street}</Text>
                <Text>streetNumber: {location[0]?.streetNumber}</Text>
                <Text>subregion: {location[0]?.subregion}</Text>
                <Text>timezone: {location[0]?.timezone}</Text>
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