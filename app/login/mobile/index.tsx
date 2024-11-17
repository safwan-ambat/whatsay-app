import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import Screen1 from '@/components/LoginMobile/Screen1';
import Screen2 from '@/components/LoginMobile/Screen2';
import Screen3 from '@/components/LoginMobile/Screen3';

const MobileLogin = () => {

    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(3);
    const [mobileNumber, setMobileNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [userName, setUserName] = useState('');
    const [isBtnDisabaled, setIsButtonDisabled] = useState(true);
    const [otpbuttonDisable, setOtpbuttonDisable] = useState(true);
    const [finalButtonDisable, setFinalButtonDisable] = useState(true);
    const [otp, setOtp] = useState(['', '', '', '']); // State for OTP digits

    const handleBack = () => {
        if (currentStep == 3) setCurrentStep(2)
        if (currentStep == 2) setCurrentStep(1)
        if (currentStep == 1) router.back()
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Screen1 selectedValue={countryCode} setSelectedValue={setCountryCode} isBtnDisabaled={isBtnDisabaled} setMobileNumber={setMobileNumber} />;
            case 2:
                return <Screen2 mobileNumber={mobileNumber} isBtnDisabaled={otpbuttonDisable} mobileOtp={otp} setMobileOtp={setOtp} />;
            case 3:
                return <Screen3 isBtnDisabaled={finalButtonDisable} setName={setUserName} name={userName} />;
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