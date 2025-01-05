import DiscoverScreen from '@/components/DiscoverScreen';
import NavBar from '@/components/Navbar';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const DiscoverScreens = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.statusBarBackground} />
            <SafeAreaView style={styles.container}>
                <ExpoStatusBar style='dark' backgroundColor='white' />
                <GestureHandlerRootView style={styles.container}>
                    <NavBar />
                    <DiscoverScreen />
                </GestureHandlerRootView>
            </SafeAreaView>
        </View>
    )
}

export default DiscoverScreens

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        zIndex:1
    },
    statusBarBackground: {
        backgroundColor: 'white',
        height: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
    }
})