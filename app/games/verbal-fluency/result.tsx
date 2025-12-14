import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -------------------------------------------------------------------------- */
/*                                   STORAGE                                  */
/* -------------------------------------------------------------------------- */

const LAST_WORDS_KEY = 'VERBAL_FLUENCY_LAST_CORRECT_WORDS';
const WORDS_HISTORY_KEY = 'VERBAL_FLUENCY_CORRECT_WORDS_HISTORY';

const getTodayKey = () => new Date().toISOString().split('T')[0];

/* -------------------------------------------------------------------------- */

export default function VerbalFluencyResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const correctWords = Number(params.correctWords ?? 0);

  const { colors: theme } = useTheme();

  useEffect(() => {
    saveCorrectWords();
  }, []);

  const saveCorrectWords = async () => {
    try {
      // Guardar último resultado
      await AsyncStorage.setItem(LAST_WORDS_KEY, correctWords.toString());

      // Guardar histórico por día
      const today = getTodayKey();
      const raw = await AsyncStorage.getItem(WORDS_HISTORY_KEY);
      const history = raw ? JSON.parse(raw) : [];

      history.push({
        date: today,
        correctWords,
      });

      await AsyncStorage.setItem(WORDS_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving verbal fluency result', e);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={[globalStyles.iconButton, { backgroundColor: 'transparent' }]}
          onPress={() => router.dismissTo('/games')}
        >
          <MaterialIcons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.glowRing, { backgroundColor: 'rgba(54, 226, 123, 0.1)' }]} />
          <View style={[styles.iconCircle, { backgroundColor: theme.surface, shadowColor: Colors.primary }]}>
            <MaterialIcons name="check-circle" size={64} color={Colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>¡Bien Hecho!</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Calentamiento cerebral completo.
        </Text>

        <Text style={[styles.context, { color: theme.textSecondary }]}>
          Fluencia Verbal Alterna
        </Text>

        {/* ✅ MOSTRAR PALABRAS CORRECTAS */}
        <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>
            Palabras correctas
          </Text>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>
            {correctWords}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={() => router.dismissTo('/games')}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.5,
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  context: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  scoreCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
