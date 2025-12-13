import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCard from '../../components/game-card';

export default function GamesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    border: isDark ? 'rgba(255,255,255,0.05)' : Colors.gray100,
    icon: isDark ? Colors.white : Colors.gray800,
    buttonHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Top App Bar */}
      <View style={[globalStyles.header, { backgroundColor: isDark ? 'rgba(17, 33, 23, 0.9)' : 'rgba(246, 248, 247, 0.9)' }]}>
        <TouchableOpacity style={[globalStyles.iconButton, { backgroundColor: 'transparent' }]}>
          <MaterialIcons name="arrow-back" size={28} color={theme.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={[globalStyles.iconButton, { backgroundColor: 'transparent' }]}>
          <MaterialIcons name="settings" size={28} color={theme.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={globalStyles.scrollView} 
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting & Context */}
        <View style={[globalStyles.titleContainer, { marginTop: 16 }]}>
          <Text style={[globalStyles.title, { color: theme.text }]}>
            Hola, Ana. {'\n'}
            <Text style={[globalStyles.subtitle, { color: theme.textSecondary }]}>
              Tómate un momento para ti.
            </Text>
          </Text>
        </View>

        {/* Daily Progress */}
        <View style={globalStyles.section}>
          <View style={[globalStyles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>META DIARIA</Text>
                <Text style={[styles.progressValue, { color: isDark ? Colors.white : Colors.gray800 }]}>1/3 Juegos</Text>
              </View>
              <View style={styles.streakContainer}>
                <MaterialIcons name="local-fire-department" size={18} color={Colors.primary} />
                <Text style={styles.streakText}>Sigue así</Text>
              </View>
            </View>
            {/* Progress Bar */}
            <View style={[styles.progressBarContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : Colors.gray100 }]}>
              <View style={[styles.progressBarFill, { width: '33%' }]} />
            </View>
          </View>
        </View>

        {/* Games List */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={[globalStyles.sectionTitle, { color: isDark ? Colors.white : Colors.gray800 }]}>Recomendados para hoy</Text>
          </View>

          <View style={globalStyles.cardsContainer}>
            {/* Card 5: Fluencia Verbal */}
            <GameCard 
              theme={theme}
              isDark={isDark}
              title="Fluencia Verbal"
              duration="~2 min"
              description="Reto de agilidad mental alternando palabras."
              category="Lenguaje"
              categoryIcon="record-voice-over"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuC-UpuOzWTkW1C_I6I3xCbOVtiM20W-7rDITIGc_xopOCBCHlxI-Vzgpv3UE44BD_d5fM-uHsDbI499SK_48sFUqChytwK-is9jdjFUPwPlqksEMXmeaCXRhYDEIl8Nxl_ymwsxAUim5ZhakxluCoNLsoBmSXXr9qkSbrUe637X6PL2i4Cvzmsm324mZGYVx3ju4PQvbXWPskfffuTZAwqZQZNtiDyTYcyMfU0ywBa-LCTKHK9nOrF0B5oj0CRVr9mYiDxn0YlTAe0"
              imageBgColor="#e0f7fa"
              imageDarkBgColor="#1a332a"
              onPress={() => router.push('/games/verbal-fluency')}
            />

            {/* Card 6: Atención */}
            <GameCard 
              theme={theme}
              isDark={isDark}
              title="Atención"
              duration="~3 min"
              description="Memoriza y repite secuencias numéricas."
              category="Memoria"
              categoryIcon="memory"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuAdwfMIPjZHGc3o76kgnV3KE8f8zTEmy2V-2_Myu_RYpFFCgHH0qquUkXyJsbab5kAzb4S7LExbYAn488ZRyiyQUMWTffWWnaHUMA3AtDZBnqnlTw-gr-u-NCxl30Zs7I-wP3-Ii_GEG1T_O-pj87EwuR0HBh8S9zlS8ftc90E9Aaq9rwFynXAy28e_R_3qNGrFCHZHtVXx3AArU-nyJ8QXkoi5YBaIuGqV9SExIvx0LBnoNJoJ-iGON6-6T0bdj7jZpkKdx2tLtT4"
              imageBgColor="#eef4ff"
              imageDarkBgColor="#1e2433"
              onPress={() => router.push('/games/atention')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: Colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 12,
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
});




