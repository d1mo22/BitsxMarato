import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '@/app/stores/gameStore';

/* -------------------------------------------------------------------------- */
/*                                   STORAGE                                  */
/* -------------------------------------------------------------------------- */

const LAST_SCORE_KEY = 'ATTENTION_LAST_SCORE';
const SCORE_HISTORY_KEY = 'ATTENTION_SCORE_HISTORY';

const getTodayKey = () => new Date().toISOString().split('T')[0];

/* -------------------------------------------------------------------------- */

export default function AttentionResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const score = Number(params.score ?? 0);
  const { colors: theme } = useTheme();
  const { markGameCompleted } = useGameStore();

  /* --------------------------- SAVE SCORE ON LOAD -------------------------- */
  useEffect(() => {
    saveScore();
  }, []);

  const saveScore = async () => {
    try {
      // Guardar último score
      await AsyncStorage.setItem(LAST_SCORE_KEY, score.toString());

      // Guardar histórico
      const today = getTodayKey();
      const rawHistory = await AsyncStorage.getItem(SCORE_HISTORY_KEY);
      const history = rawHistory ? JSON.parse(rawHistory) : [];

      history.push({
        date: today,
        score,
      });

      await AsyncStorage.setItem(
        SCORE_HISTORY_KEY,
        JSON.stringify(history)
      );

      // Marcar juego como completado
      await markGameCompleted('atention');
    } catch (e) {
      console.error('Error saving score', e);
    }
  };

  return (
    <SafeAreaView
      style={[globalStyles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="emoji-events" size={80} color={theme.primary} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          ¡Bien hecho!
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Has completado el ejercicio de atención.
        </Text>

        <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
          <Text
            style={[styles.scoreLabel, { color: theme.textSecondary }]}
          >
            Puntuación Final
          </Text>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>
            {score}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => router.replace('/(tabs)/games')}
        >
          <Text style={styles.buttonText}>Volver a Juegos</Text>
          <MaterialIcons
            name="arrow-forward"
            size={24}
            color={Colors.gray900}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 24,
    borderRadius: 9999,
    backgroundColor: 'rgba(54, 226, 123, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  scoreCard: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  scoreLabel: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
});
