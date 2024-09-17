import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface CategoryCardProps {
  category: string;
  images: { title: string; image: any }[]; // Array of images
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, images, onPress }) => {
  return (
    <StyledTouchableOpacity className="m-4 px-8" onPress={onPress}>
      <StyledText className="text-gray-600 font-domine font-semibold mb-20">{category}</StyledText>
      <StyledView className="relative h-60 w-full rounded-x flex-1">
        {images.map((item, index) => (
          <StyledImage
            key={index}
            source={item.image}
            className="absolute rounded-lg"
            style={{
              bottom: index * 15, // Vertical offset for stacking
              left: index * 15, // Horizontal offset for stacking
              width: '90%',
              height: '90%',
              zIndex: images.length - index, // Layering order
            }}
            resizeMode="cover"
          />
        ))}
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default CategoryCard;
