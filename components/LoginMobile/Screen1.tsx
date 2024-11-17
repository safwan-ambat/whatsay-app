import React from 'react'
import Title from '../Typography/Title';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { TextInput } from 'react-native';
import Button from '../Buttons/Button';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { countryCodes, FlagMap } from '@/constants/Flags';

interface Screen1Props {
    selectedValue: string;
    setSelectedValue: (selectedValue: string) => void;
    isBtnDisabaled: boolean;
    setMobileNumber: (number: string) => void
}

const Screen1 = ({ selectedValue, setSelectedValue, isBtnDisabaled, setMobileNumber }: Screen1Props) => {

    const renderItem = (item: any) => {
        const active: any = countryCodes.find((item: any) => item.code === selectedValue)?.name;
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
                    <TextInput placeholder='Enter phone number' className='text-xl placeholder:tex-[#B2B9BD] text-black font-geist font-medium' onChangeText={(text) => setMobileNumber(text)} />
                </View>
                <Button disabled={isBtnDisabaled}>
                    <Text className='text-center font-geist text-base font-medium' style={{ color: "#FFF" }}>Continue</Text>
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