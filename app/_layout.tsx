// app/_layout.tsx
import { Stack, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useEffect } from "react";
import { View } from 'react-native';
import { AuthProvider } from '@/config/authContext';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "@/redux/store";
import FONTS from "@/assets/fonts";

let persistor = persistStore(store);

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(FONTS);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        if (error) throw error;

        // Add minimum delay for splash screen (1.5 seconds)
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
    <AuthProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
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
                  name="profileScreen"
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
                    animation: 'fade'
                  }}
                />

                <Stack.Screen name="login/mobile"/>
              </Stack>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}