import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import News_data from '../constants/news-data';
import { Card } from '@/components/CardAnimation';
import menuIcon from '@/assets/iconMenu.webp';
import searchIcon from '@/assets/iconSearch.webp';
import { NewsItem, NewsCategory } from '@/types';

import curatedIcon from '@/assets/categoryIcons/curatedIcon.webp';
import internationalIcon from '@/assets/categoryIcons/InternationalIcon.webp';

import { LinearGradient } from 'expo-linear-gradient';

type CategoryIconKey = 'Curated for you' | 'International News' | string;

const categoryIcons: Record<CategoryIconKey, any> = {
  'Curated for you': curatedIcon,
  'Latest News': internationalIcon,
  // Add more mappings as needed
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledLinearGradient = styled(LinearGradient);

export default function DiscoverScreen() {
  const router = useRouter();
  const [newsData, setNewsData] = useState<NewsCategory[]>(News_data);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const handleItemPress = (category: NewsCategory, itemIndex: number) => {
    router.push({
      pathname: '/expandedNewsScreen',
      params: { category: JSON.stringify(category), initialIndex: itemIndex }
    });
  };

  const handleSwipe = useCallback((categoryIndex: number, itemIndex: number, direction: 'left' | 'right') => {
    setNewsData(prevData => {
      const newData = [...prevData];
      const category = { ...newData[categoryIndex] };
      const newItems = [...category.data];
      const [removedItem] = newItems.splice(itemIndex, 1);
      newItems.push(removedItem);
      category.data = newItems;
      newData[categoryIndex] = category;
      return newData;
    });
  }, []);

  const renderNavbar = () => (
    <StyledView className="absolute top-0 left-0 right-0 z-10">
      <StyledView className="flex-row justify-between items-center pt-4 px-[18px] pb-5 rounded-b-[60px] bg-white">
        <Image source={menuIcon} className="w-9 h-9" resizeMode="contain" />
        <StyledText className="font-domine text-2xl text-black">Discover</StyledText>
        <TouchableOpacity>
          <Image source={searchIcon} className="w-9 h-9" resizeMode="contain" />
        </TouchableOpacity>
      </StyledView>
     
    </StyledView>
  );

  const renderCategory = (category: NewsCategory, categoryIndex: number) => {
    const translateX = useSharedValue(0);
    const activeIndex = useSharedValue(0);

    return (
      <StyledView key={categoryIndex} className="border-b-2 border-[#F3F4F6] pb-[300px] pt-5">
        <StyledView className='flex-row items-center pl-[16px]'>
            <Image 
                source={categoryIcons[category.category as CategoryIconKey]}
                className="w-[24px] h-[24px] mr-2"
                resizeMode="contain"
            />
            <StyledText className="text-xl font-domine">{category.category}</StyledText>
        </StyledView>
        <View style={[styles.cardContainer, { width: SCREEN_WIDTH }]}>
          <StyledView  className="flex justify-center w-[300px] " >
              {category.data.slice(0, 3).map((item, itemIndex) => (
                <Card
                  key={item.id}
                  card={{
                    id: item.id,
                    title: item.title,
                    image: item.image,
                  }}
                  index={itemIndex}
                  totalCards={Math.min(category.data.length, 3)}
                  activeIndex={activeIndex}
                  translateX={translateX}
                  onSwipe={(direction) => {
                    handleSwipe(categoryIndex, itemIndex, direction);
                    translateX.value = 0;
                    activeIndex.value = 0;
                  }}
                  onPress={() => handleItemPress(category, itemIndex)}
                />
              )).reverse()}
          </StyledView>
         
        </View>
      </StyledView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={styles.container}>
      {renderNavbar()}
        <StyledScrollView contentContainerStyle={styles.scrollViewContent}>
           <StyledLinearGradient
              colors={['rgba(5,225,215,0.3)', 'rgba(5,235,215,0)']}
              className="h-[100px] w-full fixed  z-10"
            />
          {newsData.map(renderCategory)}
        </StyledScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  scrollViewContent: {
    flexGrow: 0.5,
    backgroundColor: 'white',
    

  },
  cardContainer: {
    height: 180, // Reduced height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
     // Allow cards to overflow their container
  },
});