import React, { useRef, useState } from 'react'
import Title from '../Typography/Title';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import Button from '../Buttons/Button';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { maskMobileNumber } from '@/utils/PhoneNumberHelper';

interface Screen2Props {
    mobileNumber: string;
    isBtnDisabaled: boolean;
    mobileOtp: string[];
    setMobileOtp: (otp:string[])=> void;
    countryCode: string;
}

const Screen2 = ({ mobileNumber, isBtnDisabaled, mobileOtp, setMobileOtp,countryCode }: Screen2Props) => {

    const inputRefs: any = useRef([]); // Refs for each TextInput

    const handleInputChange = (text: any, index: number) => {
        const updatedOtp:any = [...mobileOtp];
        updatedOtp[index] = text;

        // If user enters a digit, move to the next input
        if (text.length === 1 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        setMobileOtp(updatedOtp);
    };

    const handleKeyPress = (e: any, index: any) => {
        // Handle backspace to move focus back
        if (e.nativeEvent.key === 'Backspace' && mobileOtp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <>
            <View className='w-full '>
                <Title>Enter the OTP sent to</Title>
                <Title>{countryCode + maskMobileNumber(mobileNumber)}</Title>
            </View>
            <View className='w-full flex-1 h-full relative flex flex-col justify-between mt-10 pb-10'>
                <View style={styles.otpContainer}>
                    {mobileOtp.map((digit, index) => (
                        <TextInput
                        className='font-geist'
                            key={index}
                            style={styles.otpBox}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleInputChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                        />
                    ))}
                </View>
                <Button disabled={isBtnDisabaled}>
                    <Text className='text-center font-geist text-base font-medium' style={{ color: "#FFF" }}>Confirm</Text>
                </Button>
            </View>
        </>
    )
}

export default Screen2

const styles = StyleSheet.create({
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    otpBox: {
        width: 80,
        height: 71,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 36,
        marginHorizontal: 8,
        backgroundColor: '#F5F3F0'
    }
});