
"use client"

import { CategoryType } from '@/types/CategoryTypes';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CategoryArticles from './CategoryArticles';
import { getCategories } from '@/api/apiCategories';

const DiscoverScreen = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    
    useEffect(() => {
        (async () => {
            try {
                const response = await getCategories();
                // Ensure index is number type
                const categoriesWithIndex = response.map((category: Omit<CategoryType, 'index'>, idx: number) => ({
                    ...category,
                    index: Number(idx) // Explicitly convert to number
                }));
                setCategories(categoriesWithIndex);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        })();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <LinearGradient
                colors={['rgba(5,225,215,0.3)', 'rgba(5,235,215,0)']}
                className="h-[100px] w-full absolute top-0 z-10 bg-fixed">
            </LinearGradient>
            {categories.map((category: CategoryType) => (
                <CategoryArticles 
                    category={category} 
                    key={category.id}
                />
            ))}
        </ScrollView>
    )
}

export default DiscoverScreen;

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingTop: 88
    }
});