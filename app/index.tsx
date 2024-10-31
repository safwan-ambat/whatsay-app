import { View, Text, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import AppGradient from "@/components/AppGradient";
import Animated, {
    FadeInDown
} from "react-native-reanimated";

const App = () => {
    const router = useRouter();

    return (
        <View className="flex-1">
           
                <AppGradient
                    // Background Linear Gradient
                    colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                >
                    <SafeAreaView className="flex flex-1 px-1 justify-between">
                        <Animated.View
                            entering={FadeInDown.delay(300)
                                .mass(0.5)
                                .stiffness(80)
                                .springify(20)}
                        >
                            <Text className="text-center text-black font-bold text-4xl">
                                Whatsay
                            </Text>
                            <Text className="text-center text-black font-regular text-2xl mt-3">
                                One spot for global news
                            </Text>
                        </Animated.View>

                        <Animated.View
                        style={{ marginBottom: Platform.OS === 'ios' ? 0 : 20 }}
                            entering={FadeInDown.delay(300)
                                .mass(0.5)
                                .stiffness(80)
                                .springify(20)}
                        >
                            <CustomButton
                                onPress={() => router.push("/discoverScreens")}
                                title="Get Started"
                            />
                        </Animated.View>

                        <StatusBar style="light" />
                    </SafeAreaView>
                </AppGradient>
            
        </View>
    );
};

export default App;
