import React, { useState } from 'react';
import { 
  View, Text, Image, TouchableOpacity, SafeAreaView, 
  Modal, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { router, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { loggedInUserDataSelector, setUser } from '@/redux/slice/userSlice';
import { AuthPayload } from '@/types/UserTypes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import APIService, { APICaller } from '@/api/APIKit';

const ProfileDetailsScreen = () => {
  const dispatch = useDispatch();
  const loggedInUserData: AuthPayload | null = useSelector(loggedInUserDataSelector);
  
  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [newName, setNewName] = useState(loggedInUserData?.user?.name || '');
  const [newEmail, setNewEmail] = useState(loggedInUserData?.user?.email || '');
  const [loading, setLoading] = useState(false);

  type Route = Href<string>;

  if (!loggedInUserData?.user) {
    router.replace('/(auth)/login' as Route);
    return null;
  }

  const handleProfilePicture = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to update profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        
        // Create form data for image upload with correct typing
        const formData = new FormData();
        const imageUri = result.assets[0].uri;
        const filename = imageUri.split('/').pop() || 'profile_pic.jpg';
        
        // @ts-ignore - React Native FormData type differs from standard FormData
        formData.append('profile_pic', {
          uri: imageUri,
          type: 'image/jpeg',
          name: filename,
        });

        try {
          // Replace with your actual endpoint
          const response = await APICaller(
            APIService.put(`/user/profile-picture/${loggedInUserData.user.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
          );

          if (response) {
            dispatch(setUser({
              ...loggedInUserData,
              user: { ...loggedInUserData.user, pic: response.pic }
            }));
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access photo library');
    } finally {
      setLoading(false);
    }
};

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual endpoint
      const response = await APICaller(
        APIService.put(`/user/update/${loggedInUserData.user.id}`, {
          name: newName
        })
      );

      if (response) {
        dispatch(setUser({
          ...loggedInUserData,
          user: { ...loggedInUserData.user, name: newName }
        }));
        setNameModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual endpoint
      const response = await APICaller(
        APIService.put(`/user/update/${loggedInUserData.user.id}`, {
          email: newEmail
        })
      );

      if (response) {
        dispatch(setUser({
          ...loggedInUserData,
          user: { ...loggedInUserData.user, email: newEmail }
        }));
        setEmailModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image
        source={require("@/assets/profileBg.webp")}
        className="absolute w-screen h-[406px]"
        resizeMode="cover"
      />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-domine">Profile</Text>
        <View className="w-8" />
      </View>

      {/* Profile Picture Section */}
      <View className="items-center mt-8">
        <View className="relative">
          <Image
            source={{ uri: loggedInUserData.user.pic }}
            className="w-[120px] h-[120px] rounded-full border-white border-[3px]"
            resizeMode="cover"
          />
          <TouchableOpacity 
            className="absolute bottom-0 right-0"
            onPress={handleProfilePicture}
          >
            <View className='h-[36px] w-[36px] bg-white rounded-full items-center justify-center'>
              <View className="h-[30px] w-[30px] bg-[#7A84B7] border-[#6570A6] border-2 rounded-full items-center justify-center">
                <MaterialIcons name="edit" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Details */}
      <View className="px-4 mt-12">
        {/* Name Section */}
        <View>
          <Text className="text-[16px] font-domine text-gray-900 pb-[6px]">Name</Text>
          <View className="flex-row justify-between items-center border-b border-gray-200 pb-[20px]">
            <Text className="text-[20px] font-geist text-[#000000]/60">
              {loggedInUserData.user.name}
            </Text>
            <TouchableOpacity onPress={() => setNameModalVisible(true)}>
              <MaterialIcons name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Email Section */}
        <View className='pt-[20px]'>
          <Text className="text-[16px] font-domine text-gray-900 pb-[6px]">Email Address</Text>
          <View className="flex-row justify-between items-center py-0">
            <Text className="text-[20px] font-geist text-[#000000]/60">
              {loggedInUserData.user.email}
            </Text>
            <TouchableOpacity onPress={() => setEmailModalVisible(true)}>
              <MaterialIcons name="edit" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Name Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNameModalVisible}
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-[90%]">
            <Text className="text-xl font-domine mb-4">Edit Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
            />
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity 
                onPress={() => setNameModalVisible(false)}
                className="px-4 py-2"
              >
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleNameUpdate}
                className="bg-[#7A84B7] px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Email Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEmailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-[90%]">
            <Text className="text-xl font-domine mb-4">Edit Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter new email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity 
                onPress={() => setEmailModalVisible(false)}
                className="px-4 py-2"
              >
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleEmailUpdate}
                className="bg-[#7A84B7] px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
          <ActivityIndicator size="large" color="#7A84B7" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;