import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface SvgSpinners6DotsRotateProps {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export function SvgSpinners6DotsRotate({
  style,
  width = 100,
  height = 100,
}: SvgSpinners6DotsRotateProps) {
  // Create a rotating animation value
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the rotation infinitely
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1500, // adjust speed here
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate the rotation value from 0 to 360 degrees
  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={style}>
      <Animated.View
        style={{
          transform: [{ rotate: rotation }],
        }}
      >
        <Svg width={width} height={height} viewBox="0 0 24 24">
          <Circle cx={12} cy={2.5} r={1.5} fill="currentColor" opacity={0.14} />
          <Circle cx={16.75} cy={3.77} r={1.5} fill="currentColor" opacity={0.29} />
          <Circle cx={20.23} cy={7.25} r={1.5} fill="currentColor" opacity={0.43} />
          <Circle cx={21.5} cy={12} r={1.5} fill="currentColor" opacity={0.57} />
          <Circle cx={20.23} cy={16.75} r={1.5} fill="currentColor" opacity={0.71} />
          <Circle cx={16.75} cy={20.23} r={1.5} fill="currentColor" opacity={0.86} />
          <Circle cx={12} cy={21.5} r={1.5} fill="currentColor" />
        </Svg>
      </Animated.View>
    </View>
  );
}
