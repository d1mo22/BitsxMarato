import { Colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameCardProps {
  theme: {
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  isDark: boolean;
  title: string;
  duration: string;
  description: string;
  category: string;
  categoryIcon: string;
  imageUri: string;
  imageBgColor: string;
  imageDarkBgColor: string;
  onPress?: () => void;
}

export default function GameCard({ theme, isDark, title, duration, description, category, categoryIcon, imageUri, imageBgColor, imageDarkBgColor, onPress }: GameCardProps) {
  return (
    <View style={[styles.gameCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.gameCardContent}>
        {/* Image Area */}
        <View style={[styles.gameImageContainer, { backgroundColor: isDark ? imageDarkBgColor : imageBgColor }]}>
          <Image source={{ uri: imageUri }} style={styles.gameImage} />
        </View>
        
        {/* Content Area */}
        <View style={styles.gameInfo}>
          <View style={styles.gameHeader}>
            <Text style={[styles.gameTitle, { color: theme.text }]}>{title}</Text>
            <View style={[styles.durationBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.gray100 }]}>
              <Text style={[styles.durationText, { color: isDark ? Colors.gray300 : Colors.gray600 }]}>{duration}</Text>
            </View>
          </View>
          
          <Text style={[styles.gameDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {description}
          </Text>
          
          <View style={styles.gameFooter}>
            <View style={styles.categoryContainer}>
              <MaterialIcons name={categoryIcon as any} size={16} color={Colors.primary} />
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            
            <TouchableOpacity style={[
              styles.playButton,
              {
                backgroundColor: isDark ? 'rgba(54, 226, 123, 0.1)' : 'rgba(54, 226, 123, 0.2)',
              }
            ]} onPress={onPress}>
              <MaterialIcons name="play-arrow" size={20} color={Colors.primary} />
              <Text style={[styles.playButtonText, { color: Colors.primary }]}>Jugar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gameCardContent: {
    flexDirection: 'row',
    height: 140,
  },
  gameImageContainer: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  gameInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  gameDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  gameFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
