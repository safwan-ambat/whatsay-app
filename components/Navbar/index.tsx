import React from 'react'
import { Image } from 'react-native'
import { View } from 'react-native'
import menuIcon from '@/assets/iconMenu.webp'
import searchIcon from '@/assets/iconSearch.webp'
import { Text } from 'react-native'
import { TouchableOpacity } from 'react-native'

const NavBar = () => {
    return (
        <View className='absolute top-0 left-0 right-0 z-10'>
            <View className='flex-row justify-between items-center pt-4 px-[18px] pb-5 rounded-b-[60px] bg-white'>
                <Image source={menuIcon} className='w-9 h-9' resizeMode='contain' />
                <Text className='font-domine text-2xl text-black'>Discover</Text>
                <TouchableOpacity>
                    <Image source={searchIcon} className='w-9 h-9 hidden' resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NavBar