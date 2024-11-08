// _layout.tsx
import { Stack, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useEffect } from "react";
import { View } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const FONTS = {
  'Domine': require('../assets/fonts/Domine/static/Domine-Regular.ttf'),
  'Domine-Medium': require('../assets/fonts/Domine/static/Domine-Medium.ttf'),
  'Domine-SemiBold': require('../assets/fonts/Domine/static/Domine-SemiBold.ttf'),
  'Domine-Bold': require('../assets/fonts/Domine/static/Domine-Bold.ttf'),
  "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  'Geist': require('@/assets/fonts/Geist/Geist-Regular.ttf'),
  'Geist-Medium': require('@/assets/fonts/Geist/Geist-Medium.ttf'),
  'Geist-Bold': require('@/assets/fonts/Geist/Geist-Bold.ttf'),
  'Geist-Light': require('@/assets/fonts/Geist/Geist-Light.ttf'),
} as const;

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(FONTS);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        if (error) throw error;
        
        // Add minimum delay for splash screen (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.error('Error loading fonts or hiding splash screen:', e);
      }
    };

    hideSplash();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return <View style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Add your error UI here */}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="loginScreen"
            options={{
              gestureEnabled: true,
              animation: 'fade'
            }}
          />
          <Stack.Screen
            name="discoverScreens"
            options={{
              gestureEnabled: true,
              animation: 'fade'
            }}
          />
          <Stack.Screen
            name="(news)/[slug]"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}