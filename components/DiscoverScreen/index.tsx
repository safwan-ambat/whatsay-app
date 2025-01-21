"use client"

import { CategoryType } from '@/types/CategoryTypes';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CategoryArticles from './CategoryArticles';
import { getCategories } from '@/api/apiCategories';
import useLocation from '@/hooks/useLocation';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
    Extrapolate,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { getLast48HoursRange } from '@/utils/DataAndTimeHelper';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const INITIAL_GRADIENT_HEIGHT = 150;
const MAX_PULL_DISTANCE = 220;

const GRADIENT_COLORS = [
    ['rgba(5,225,215,0.6)', 'rgba(5,235,215,0)'],           // Turquoise
    ['rgba(255,105,180,0.6)', 'rgba(255,105,180,0)'],       // Hot Pink
    ['rgba(147,112,219,0.6)', 'rgba(147,112,219,0)'],       // Purple
    ['rgba(255,165,0,0.6)', 'rgba(255,165,0,0)'],           // Orange
    ['rgba(50,205,50,0.6)', 'rgba(50,205,50,0)']            // Lime Green
] as const;

const DEFAULT_GRADIENT = ['rgba(5,225,215,0.6)', 'rgba(5,235,215,0)'];

const DiscoverScreen = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [currentGradientIndex, setCurrentGradientIndex] = useState(0);
    const { location, errorMsg } = useLocation();
    const scrollY = useSharedValue(0);
    const isRefreshing = useSharedValue(false);

    const getCurrentGradientColors = () => {
        try {
            return GRADIENT_COLORS[currentGradientIndex] || DEFAULT_GRADIENT;
        } catch (error) {
            console.error('Error getting gradient colors:', error);
            return DEFAULT_GRADIENT;
        }
    };

    useEffect(() => {
        (async () => {
            const { from, to } = getLast48HoursRange();
            try {
                const response = await getCategories(from, to);
                const categoriesWithIndex = response.map((category: Omit<CategoryType, 'index'>, idx: number) => ({
                    ...category,
                    index: Number(idx)
                }));
                setCategories(categoriesWithIndex);
            } catch (error) {
                console.log("error",error);
                
                console.error("Error fetching categories:", error);
            }
        })();
    }, [location]);

    const handleGradientChange = () => {
        setCurrentGradientIndex((prevIndex) => (prevIndex + 1) % GRADIENT_COLORS.length);
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const offsetY = event.contentOffset.y;
            scrollY.value = offsetY;

            if (offsetY < -MAX_PULL_DISTANCE * 0.5) {
                if (!isRefreshing.value) {
                    isRefreshing.value = true;
                    runOnJS(handleGradientChange)();
                }
            } else if (offsetY >= 0) {
                isRefreshing.value = false;
            }
        },
    });

    const gradientStyle = useAnimatedStyle(() => {
        const height = interpolate(
            scrollY.value,
            [-MAX_PULL_DISTANCE, 0],
            [INITIAL_GRADIENT_HEIGHT + MAX_PULL_DISTANCE, INITIAL_GRADIENT_HEIGHT],
            Extrapolate.CLAMP
        );

        const opacity = interpolate(
            scrollY.value,
            [-MAX_PULL_DISTANCE, 0],
            [0.8, 0.3],
            Extrapolate.CLAMP
        );

        return {
            height,
            opacity: withTiming(opacity, { duration: 150 }),
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-MAX_PULL_DISTANCE, 0, INITIAL_GRADIENT_HEIGHT],
                        [0, 0, -INITIAL_GRADIENT_HEIGHT],
                        Extrapolate.CLAMP
                    )
                }
            ],
        };
    });

    const currentGradientColors = getCurrentGradientColors();

    return (
        <View style={styles.container}>
            <View style={styles.gradientContainer}>
                <AnimatedLinearGradient
                    colors={currentGradientColors}
                    style={[styles.gradient, gradientStyle]}
                />
            </View>
            <AnimatedScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollViewContent}
                bounces={true}
            >
                {categories.map((category: CategoryType,index:number) => (
                    <CategoryArticles
                        category={category}
                        key={category.id}
                    />
                ))}
            </AnimatedScrollView>
        </View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 20,
    },
    gradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: INITIAL_GRADIENT_HEIGHT,
        overflow: 'visible',
    },
    gradient: {
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingTop: 88,
        zIndex:50,
    }
});