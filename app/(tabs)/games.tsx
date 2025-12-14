import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCard from '../../components/game-card';
import { useGameStore } from '@/app/stores/gameStore';

export default function GamesScreen() {
  const router = useRouter();
  const { colors: theme, isDark } = useTheme();
  const { getDailyProgress, refresh } = useGameStore();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const progress = getDailyProgress();
  const progressPercent = Math.min(100, Math.round((progress.completedCount / progress.totalTarget) * 100));

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[globalStyles.header, { paddingHorizontal: 16 }]}>
        <Text style={[globalStyles.title, { color: theme.text }]}>Juegos</Text>
      </View>

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Daily Progress */}
        <View style={globalStyles.section}>
          <View style={[globalStyles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>META</Text>
                <Text style={[styles.progressValue, { color: isDark ? Colors.white : Colors.gray800 }]}>
                  {progress.completedCount}/{progress.totalTarget} Juegos
                </Text>
              </View>
              <View style={styles.streakContainer}>
                <MaterialIcons name="local-fire-department" size={18} color={Colors.primary} />
                <Text style={styles.streakText}>Sigue así</Text>
              </View>
            </View>
            {/* Progress Bar */}
            <View style={[styles.progressBarContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : Colors.gray100 }]}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </View>

        {/* Games List */}
        <View style={globalStyles.section}>
          <View style={globalStyles.sectionHeader}>
            <Text style={[globalStyles.sectionTitle, { color: isDark ? Colors.white : Colors.gray800 }]}>Recomendados para hoy</Text>
          </View>

          <View style={globalStyles.cardsContainer}>
            {/* Fluencia Verbal */}
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
              completed={progress.completedGames.includes('verbal-fluency')}
            />

            {/* Atención */}
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
              completed={progress.completedGames.includes('atention')}
            />

            {/* Velocidad de Procesamiento */}
            <GameCard
              theme={theme}
              isDark={isDark}
              title="Velocidad"
              duration="~2 min"
              description="Encuentra los números en orden ascendente."
              category="Velocidad"
              categoryIcon="speed"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Kv7V3IVgUAgHKAZyUxClJ7XXm4eY2CH5PN3uQ8FiL_0CmvfDTPN_dYsqFzMOEzxEmSB864XPVAV68iGXn5dXsqPgHhoWbREPmYiLDejd3Le_DtTirRilLtFU1obNVlNsI0YAFJQXRbg7EixmYYJeRC8EUhPvLhqxaAVoYhsVUSeMekBveAo9gD9xPjVIruyF0hhbU2BDkeUCtZtEtO6YA6nbLlcF3g3ispqUm8inysM8ML0PypNb-WWBucD-OitR4KW9yYeNQ9o"
              imageBgColor="#eef4ff"
              imageDarkBgColor="#1e2433"
              onPress={() => router.push('/games/sort')}
              completed={progress.completedGames.includes('sort')}
            />

            {/*Memoria de Trabajo (Reves) */}
            <GameCard
              theme={theme}
              isDark={isDark}
              title="Memoria Inversa"
              duration="~3 min"
              description="Repite la secuencia de números al revés."
              category="Memoria"
              categoryIcon="psychology"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuAdwfMIPjZHGc3o76kgnV3KE8f8zTEmy2V-2_Myu_RYpFFCgHH0qquUkXyJsbab5kAzb4S7LExbYAn488ZRyiyQUMWTffWWnaHUMA3AtDZBnqnlTw-gr-u-NCxl30Zs7I-wP3-Ii_GEG1T_O-pj87EwuR0HBh8S9zlS8ftc90E9Aaq9rwFynXAy28e_R_3qNGrFCHZHtVXx3AArU-nyJ8QXkoi5YBaIuGqV9SExIvx0LBnoNJoJ-iGON6-6T0bdj7jZpkKdx2tLtT4"
              imageBgColor="#f2f0ff"
              imageDarkBgColor="#121022"
              onPress={() => router.push('/games/reves')}
              completed={progress.completedGames.includes('reves')}
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




