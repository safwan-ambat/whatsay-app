import DiscoverScreen from '@/components/DiscoverScreen';
import NavBar from '@/components/Navbar';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const DiscoverScreens = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='dark' />
            <GestureHandlerRootView style={styles.container}>
                <NavBar />
                <DiscoverScreen />
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}

export default DiscoverScreens

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

