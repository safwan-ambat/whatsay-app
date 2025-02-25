import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { usePathname, useRouter } from 'expo-router';
import Screen1 from '@/components/LoginMobile/Screen1';
import Screen2 from '@/components/LoginMobile/Screen2';
import Screen3 from '@/components/LoginMobile/Screen3';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slice/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MobileLogin = () => {

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(1);
    const [mobileNumber, setMobileNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [userName, setUserName] = useState('');
    const [isBtnDisabaled, setIsButtonDisabled] = useState(true);
    const [otpbuttonDisable, setOtpbuttonDisable] = useState(true);
    const [finalButtonDisable, setFinalButtonDisable] = useState(true);
    const [otp, setOtp] = useState(''); // State for OTP digits

    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState<any>(null);

    useEffect(() => {
        if (pathname == '/firebaseauth/link') router.back();
    }, [pathname])

    const handleBack = () => {
        if (currentStep == 3) setCurrentStep(2)
        if (currentStep == 2) setCurrentStep(1)
        if (currentStep == 1) router.back()
    }

    const handleSendOtp = async () => {
        const number = `${countryCode} ${mobileNumber}`
        try {
            await auth().signInWithPhoneNumber(number).then((e: any) => {
                setConfirm(e);
            })
            setCurrentStep(2)
        } catch (error) {
            console.log("error", error);
        }
    }

    async function confirmCode() {
        try {
            const response = await confirm.confirm(otp);
            const { isNewUser } = response.additionalUserInfo;
            const { displayName } = response.user;

            if (isNewUser || !displayName) {
                setCurrentStep(3);
            } else {
                const user: any = auth().currentUser;

                // Dispatch user data to Redux store
                dispatch(setUser({
                    user: user,
                    token: user.refreshToken // You can send the token or any relevant user data
                }));

                // Store user data in AsyncStorage for session persistence
                await AsyncStorage.setItem('user', JSON.stringify(user));

                // Navigate to discover screen
                router.replace({
                    pathname: "/discoverScreens"
                });
            }
        } catch (error) {
            console.log('Invalid code.');
        }
    }

    const handleFinalSubmit = async () => {
        const user: any = auth().currentUser;

        if (user && userName) {
            try {
                // Update user's profile with the new username
                await user.updateProfile({
                    displayName: userName
                })

                // Dispatch user data to Redux store
                dispatch(setUser({
                    user: user,
                    token: user.refreshToken // You can send the token or any relevant user data
                }));

                // Store user data in AsyncStorage for session persistence
                await AsyncStorage.setItem('user', JSON.stringify(user));

                // Navigate to discover screen
                router.replace({
                    pathname: "/discoverScreens"
                });
            } catch (error) {
                console.log('Error updating user profile:', error);
            }
        }
    };

    useEffect(() => {
        if (otp.length == 4) setOtpbuttonDisable(false)
        if (userName.length > 0) setFinalButtonDisable(false)
    }, [otp, userName])

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Screen1 selectedValue={countryCode} setSelectedValue={setCountryCode} isBtnDisabled={isBtnDisabaled} setMobileNumber={setMobileNumber} setIsButtonDisabled={setIsButtonDisabled} buttonAction={handleSendOtp} mobileNumber={mobileNumber} />;
            case 2:
                return <Screen2 mobileNumber={mobileNumber} countryCode={countryCode} isBtnDisabaled={otpbuttonDisable} mobileOtp={otp} setMobileOtp={setOtp} buttonAction={confirmCode} />;
            case 3:
                return <Screen3 isBtnDisabaled={finalButtonDisable} setName={setUserName} name={userName} buttonAction={handleFinalSubmit} />;
            default:
                return null;
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View className='px-[16px] flex-1'>
                <AntDesign name="arrowleft" style={{ marginTop: 16 }} size={28} color="#000" onPress={handleBack} />
                <View className='mt-8 flex-1'>
                    {renderStep()}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default MobileLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Adjust according to your design
    }
});