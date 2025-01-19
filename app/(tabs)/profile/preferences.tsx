import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { apiGetCategoriesWithPreferences, apiUpdateUserPreference } from '@/api/apiCategories';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPreferredCategories, userPreferredCategoriesDataSelector } from '@/redux/slice/categorySlice';
import { CategoryType } from '@/types/CategoryTypes';
import { AuthPayload } from '@/types/UserTypes';
import { loggedInUserDataSelector } from '@/redux/slice/userSlice';

const PreferencesScreen = () => {

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const categoriesData: any = useSelector(userPreferredCategoriesDataSelector);

  const loggedInUserData: AuthPayload | null = useSelector(loggedInUserDataSelector);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (id: any) => {
    // Update the `isPreferred` flag in categoriesData (Note: this won't trigger re-render since we're not updating the Redux store here)
    const updatedCategories = categoriesData.map((category: CategoryType) =>
      category.id === id
        ? { ...category, isPreferred: !category.isPreferred }
        : category
    );

    // Optionally, you can dispatch the updated categories to Redux if you want to store this updated state globally
    dispatch(setUserPreferredCategories(updatedCategories));

    setSelectedCategories((prevSelected: any) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item: string) => item !== id) // Remove if already selected
        : [...prevSelected, id] // Add if not selected
    );
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<CategoryType>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          disabled={isActive}
          className={` py-4 px-3 mb-1 bg-[#F6F7F9] rounded-[8px] ${isActive ? 'shadow-md' : ''}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <TouchableOpacity
                onPress={() => toggleCategory(item.id)}
                className="w-4 h-4 rounded-full items-center justify-center"
                style={item.isPreferred ? { backgroundColor: '#35B267', borderWidth: 1, borderColor: '#35B267' } : { borderWidth: 1, borderColor: '#000000', opacity: 0.5 }}
              >
                {item.isPreferred && <Feather name="check" size={12} color="white" />}
              </TouchableOpacity>
              <Image
                source={{ uri: item.icon_url }}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="text-4 font-domine">{item.name}</Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity onLongPress={drag} className='opacity-50'>
                <Feather name="menu" size={20} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const handleSaveChanges = async () => {
    try {
      const userId: any = loggedInUserData?.user.id; // Ensure this exists
      await apiUpdateUserPreference(selectedCategories, userId).then(async (res: any) => {
        if (res.status == 200) {
          const apiRes = await apiGetCategoriesWithPreferences(userId);
          if (apiRes) {
            // Dispatch categories to Redux store
            dispatch(setUserPreferredCategories(apiRes));

            // Set the selected categories based on `isPreferred` flag
            setSelectedCategories(
              apiRes
                .filter((category: CategoryType) => category.isPreferred)
                .map((category: CategoryType) => category.id)
            );
          }
        }
        // Customizing Alert Message
        Alert.alert(
          'Success!',
          'Your preferences for Category have been successfully updated.',
          [
            {
              text: 'OK',
              onPress: () => console.log('User clicked OK'),
              style: 'default', // Default button style
            },
          ],
          { cancelable: false }
        );
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const userId = loggedInUserData?.user.id; // Ensure this exists
        if (userId) {
          const apiRes = await apiGetCategoriesWithPreferences(userId);
          if (apiRes) {
            // Dispatch categories to Redux store
            dispatch(setUserPreferredCategories(apiRes));

            // Set the selected categories based on `isPreferred` flag
            setSelectedCategories(
              apiRes
                .filter((category: CategoryType) => category.isPreferred)
                .map((category: CategoryType) => category.id)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loggedInUserData?.user.id, dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-5 pb-[24px]">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-domine">Preferences</Text>
        <View className="w-8" />
      </View>

      {/* Description */}
      <Text className="text-gray-500 text-[14p] font-geist px-4 pb-7">
        You'll see more news from your selected categories and less from others. Long press and drag to prioritize news and update them anytime to refresh your feed.
      </Text>

      {(!categoriesData && isLoading || categoriesData.length === 0) ?
        <ActivityIndicator size="large" color="black" />
        :
        <DraggableFlatList
          data={categoriesData}
          // onDragEnd={({ data }) => setCategories(data)}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          containerStyle={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

      }

      {/* Save Button */}
      <View className="px-4 py-4">
        <TouchableOpacity
          className="bg-black rounded-lg py-4"
          onPress={handleSaveChanges}
        >
          <Text className="text-white text-center font-medium">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PreferencesScreen;