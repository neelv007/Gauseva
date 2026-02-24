import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface ImageWithFallbackProps {
  source: ImageSourcePropType | { uri: string };
  fallbackInitials?: string;
  fallbackIcon?: string;
  fallbackColor?: string;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  circular?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  source,
  fallbackInitials,
  fallbackIcon = 'person',
  fallbackColor = COLORS.navy,
  style,
  resizeMode = 'cover',
  circular = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const containerStyle = [
    styles.container,
    style,
    circular && { borderRadius: 9999 },
  ];

  if (hasError || !source) {
    return (
      <View style={[containerStyle, styles.fallback, { backgroundColor: fallbackColor }]}>
        {fallbackInitials ? (
          <Text style={[styles.initialsText, { fontSize: (style?.width || 80) * 0.35 }]}>
            {fallbackInitials}
          </Text>
        ) : (
          <Ionicons
            name={fallbackIcon as any}
            size={(style?.width || 80) * 0.45}
            color={COLORS.white}
          />
        )}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={source}
        style={[styles.image, style, circular && { borderRadius: 9999 }]}
        resizeMode={resizeMode}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
