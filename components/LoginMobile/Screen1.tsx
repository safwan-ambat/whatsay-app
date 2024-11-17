import React, { useEffect, useState } from 'react'
import Title from '../Typography/Title';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from 'react-native';
import Button from '../Buttons/Button';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { countryCodes, FlagMap } from '@/constants/Flags';
import { formatPhoneNumber, getMaxLength, validatePhoneNumber } from '@/utils/PhoneNumberHelper';

interface Screen1Props {
    selectedValue: string;
    setSelectedValue: (selectedValue: string) => void;
    isBtnDisabaled: boolean;
    setIsButtonDisabled: (isBtnDisabaled: boolean) => void;
    setMobileNumber: (number: string) => void;
    buttonAction: () => void;
}

const Screen1 = ({ selectedValue, setSelectedValue, isBtnDisabaled, setMobileNumber, setIsButtonDisabled, buttonAction }: Screen1Props) => {

    const [formattedNumber, setFormattedNumber] = useState('');
    const [error, setError] = useState('');
    const [example, setExample] = useState('');

    const handlePhoneNumberChange = (text: string) => {
        // Remove any non-numeric characters from input
        const numericOnly = text.replace(/\D/g, '');

        // Check if input contains only numbers
        if (text !== '' && !/^\d*$/.test(numericOnly)) {
            setError('Please enter numbers only');
            return;
        }

        // Format the phone number
        const formatted = formatPhoneNumber(numericOnly, selectedValue);
        setFormattedNumber(formatted);

        // Validate the phone number
        if (numericOnly.length > 0) {
            if (validatePhoneNumber(numericOnly, selectedValue)) {
                setError('');
                setMobileNumber(numericOnly);
                setIsButtonDisabled(false)
            } else {
                setError('Invalid phone number format');
                setMobileNumber('');
                setIsButtonDisabled(true)
            }
        } else {
            setError('');
            setMobileNumber('');
            setIsButtonDisabled(true)
        }
    };

    const renderItem = (item: any) => {
        const active: any = countryCodes.find((country: any) => country.code === item.code)?.name;
        const activeFlag = FlagMap[active]
        return (
            <View style={styles.item}>
                <Image
                    source={activeFlag}
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                />
                <Text style={styles.textItem}>{item.code}</Text>
            </View>
        );
    };

    const activeFlagIcon = () => {
        const active: any = countryCodes.find((item: any) => item.code === selectedValue)?.name;
        const activeFlag = FlagMap[active]

        return (
            <Image
                source={activeFlag}
                style={{ width: 24, height: 24, resizeMode: 'contain', marginRight: 4 }}
            />
        );
    };

    return (
        <>
            <Title>Enter Mobile No</Title>
            <View className='w-full flex-1 h-full relative flex flex-col justify-between mt-10 pb-10'>
                <View className='w-full flex flex-row items-center gap-2'>
                    <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={countryCodes}
                        search
                        maxHeight={300}
                        labelField="code"
                        valueField="code"
                        placeholder={'Select code'}
                        searchPlaceholder="Search..."
                        value={selectedValue}
                        renderItem={renderItem}
                        onChange={(item: any) => {
                            setSelectedValue(item.code);
                        }}
                        renderLeftIcon={activeFlagIcon}
                    />
                    <TextInput
                        placeholder="Enter phone number"
                        className='text-xl placeholder:tex-[#B2B9BD] text-black font-geist font-medium'
                        value={formattedNumber}
                        onChangeText={handlePhoneNumberChange}
                        keyboardType="numeric"
                        maxLength={getMaxLength(selectedValue)}
                    />
                </View>
                <Button disabled={isBtnDisabaled}>
                    <Text className='text-center font-geist text-base font-medium' style={{ color: "#FFF" }} onPress={buttonAction}>Continue</Text>
                </Button>
            </View>
        </>
    )
}

export default Screen1

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderRadius: 40,
        paddingHorizontal: 8,
        minWidth: 100,
        alignSelf: 'flex-start',
        backgroundColor: "#41515C0A"
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        fontWeight: "medium",
        color: "#41515C",
        fontFamily: "Gentona-Book"
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
});