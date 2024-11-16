// app/loginScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeUser } from "@/api/apiUser";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/redux/slice/userSlice";

GoogleSignin.configure({
  webClientId: '396092481898-m1b6htvg05uokocbhr9i4t0k7o1tipf4.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '396092481898-s3r4cvs735fc3oo2097nipogoico5hsb.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. "GoogleService-Info-Staging"
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();

      const { user, idToken } = userInfo.data;

      dispatch(setUser({
        user: user,
        token: idToken
      }));

      // Store user data in AsyncStorage for session persistence
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));

      // Send user data to the backend API
      await storeUser(userInfo, 'via google');

      // Navigate to discover screen
      router.replace({
        pathname: "/discoverScreens"
      });
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    }
  };

  // Check if user is signed in by retrieving stored user data
  const checkIfUserIsSignedIn = async () => {
    try {
      const storedUser: any = await AsyncStorage.getItem('user');

      if (storedUser) {

        const { idToken, user } = JSON.parse(storedUser).data;
        dispatch(setUser({
          user: user,
          token: idToken
        }));
        
        // Send user data to the backend API
        await storeUser(storedUser, 'via google');

        // Navigate to discover screen
        router.replace({
          pathname: "/profileScreen"
        });
      } else {
        dispatch(clearUser());
      }
    } catch (error) {
      console.error("Error checking user sign-in status:", error);
    }
  };

  useEffect(() => {
    checkIfUserIsSignedIn()
  }, [])

  return (
    <ImageBackground
      source={require("@/assets/loginBg.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 px-[16px]">
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-2xl text-black">←</Text>
        </TouchableOpacity>

        <View className="flex-1 items-center mt-[372px]">
          <View className="mb-[66px] items-center">
            <Text className="font-domine text-[28px] mb-2 text-center text-black">
              News curated
            </Text>
            <Text className="font-domine text-[28px] text-center text-black">
              Perspectives invited
            </Text>
          </View>

          <TouchableOpacity
            className="w-full bg-black rounded-[12px] py-4 px-6 flex-row items-center justify-center mb-4"
            onPress={() => signInWithGoogle()}
          >
            <Image
              source={require("@/assets/googleIcon.webp")}
              className="w-7 h-7 mr-3"
              resizeMode="contain"
            />
            <Text className="text-white font-medium text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-white rounded-[12px] py-4 px-6 flex-row items-center justify-center"
            onPress={() => {
              console.log("Phone sign in pressed");
            }}
          >
            <Image
              source={require("@/assets/mobileIcon.webp")}
              className="w-7 h-7 mr-3"
              resizeMode="contain"
            />
            <Text className="text-black font-medium text-base">
              Continue with Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* <GoogleAccountsModal
          visible={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          onSelectAccount={handleAccountSelect}
          accounts={googleAccounts}
        /> */}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;