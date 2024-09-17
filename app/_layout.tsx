import { Stack, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding until loading all the assets is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Domine': require('../assets/fonts/Domine/static/Domine-Regular.ttf'),
    'Domine-Medium': require('../assets/fonts/Domine/static/Domine-Medium.ttf'),
    'Domine-SemiBold': require('../assets/fonts/Domine/static/Domine-SemiBold.ttf'),
    'Domine-Bold': require('../assets/fonts/Domine/static/Domine-Bold.ttf'),
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="discoverScreen" options={{ headerShown: false }} />
         
         
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}