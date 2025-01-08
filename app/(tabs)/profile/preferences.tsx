import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, ScrollView } from 'react-native';
import { router, Href } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import DraggableFlatList, { 
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  automobile,
  breakingNews,
  business,
  entertainment,
  health,
  internationalNews,
  lifestyle,
  opinions,
  politics,
  science,
  sports,
  startup,
  technology,
  travel,
  world,
  finance
} from '@/assets';

type Route = Href<string>;

interface Category {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
}

const PreferencesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Automobile', icon: automobile, enabled: true },
    { id: '2', name: 'International News', icon: internationalNews, enabled: true },
    { id: '3', name: 'Business', icon: business, enabled: true },
    { id: '4', name: 'Breaking news', icon: breakingNews, enabled: true },
    { id: '5', name: 'Entertainment', icon: entertainment, enabled: true },
    { id: '6', name: 'Health', icon: health, enabled: true },
    { id: '7', name: 'Lifestyle', icon: lifestyle, enabled: true },
    { id: '8', name: 'Opinions', icon: opinions, enabled: true },
    { id: '9', name: 'Politics', icon: politics, enabled: true },
    { id: '10', name: 'Science', icon: science, enabled: true },
    { id: '11', name: 'Sports', icon: sports, enabled: true },
    { id: '12', name: 'Technology', icon: technology, enabled: true },
    { id: '13', name: 'Startup', icon: startup, enabled: true },
    { id: '14', name: 'Travel', icon: travel, enabled: true },
    { id: '15', name: 'World', icon: world, enabled: true },
    { id: '16', name: 'Finance', icon: finance, enabled: true },
  ]);

  const toggleCategory = (id: string) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, enabled: !category.enabled } : category
    ));
  };

  const handleSaveChanges = () => {
    // Implement save functionality
    console.log('Saving preferences:', categories);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Category>) => {
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
                style={item.enabled ? { backgroundColor: '#35B267', borderWidth: 1, borderColor: '#35B267' } : { borderWidth: 1, borderColor: '#000000', opacity: 0.5 }}
              >
                {item.enabled && <Feather name="check" size={12} color="white" />}
              </TouchableOpacity>
              <Image 
                source={item.icon}
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

      {/* Categories List */}
      <DraggableFlatList
        data={categories}
        onDragEnd={({ data }) => setCategories(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

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