import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

const GAME_ID = 'ATTENTION_GAME_LAST_PLAYED'; // Mismo ID

export default function AttentionGame() {
  const router = useRouter();
  const { colors: theme, isDark } = useTheme();

  const [level, setLevel] = useState(4); 
  const [trial, setTrial] = useState(1); 
  const [failures, setFailures] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<'presentation' | 'input' | 'feedback'>('presentation');
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);

  // Animation values
  const digitScale = useSharedValue(0);
  const digitOpacity = useSharedValue(0);
  const feedbackScale = useSharedValue(0);
  const feedbackOpacity = useSharedValue(0);

  useEffect(() => {
    startRound(4);
  }, []);

  useEffect(() => {
    return () => {
      try {
        Speech.stop();
      } catch (e) {}
    };
  }, []);

  // Función para guardar fecha
  const markGameAsPlayed = async () => {
      try {
          const today = new Date().toISOString().split('T')[0];
          await AsyncStorage.setItem(GAME_ID, today);
      } catch (e) {
          console.error("Error saving game date", e);
      }
  };

  const startRound = (currentLevel = level) => {
    const newSequence = Array.from({ length: currentLevel }, () => Math.floor(Math.random() * 10));
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('presentation');
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setCurrentDigit(seq[i]);

      digitScale.value = withSequence(withTiming(1.2, { duration: 200 }), withTiming(1, { duration: 200 }));
      digitOpacity.value = withTiming(1, { duration: 200 });

      try {
        Speech.speak(String(seq[i]), {
          language: 'es-US',
        });
      } catch (e) {}

      await new Promise(resolve => setTimeout(resolve, 1000)); 

      digitOpacity.value = withTiming(0, { duration: 200 });
      await new Promise(resolve => setTimeout(resolve, 200)); 
      setCurrentDigit(null);
    }
    setPhase('input');
  };

  const handleInput = (num: number) => {
    if (phase !== 'input') return;
    const newUserSequence = [...userSequence, num];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      checkSequence(newUserSequence);
    }
  };

  const handleBackspace = () => {
    if (phase !== 'input') return;
    setUserSequence(prev => prev.slice(0, -1));
  };

  const checkSequence = async (input: number[]) => {
    const isCorrect = input.every((val, index) => val === sequence[index]);

    const currentFailures = isCorrect ? failures : failures + 1;
    if (!isCorrect) setFailures(currentFailures);

    setPhase('feedback');
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');

    feedbackScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.3, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );
    feedbackOpacity.value = withTiming(1, { duration: 300 });

    await new Promise(resolve => setTimeout(resolve, 1500));

    feedbackOpacity.value = withTiming(0, { duration: 300 });
    await new Promise(resolve => setTimeout(resolve, 300));

    if (isCorrect) {
      setScore(prev => prev + level * 10);
    }

    // Game Logic
    if (trial === 1) {
      setTrial(2);
      startRound(level);
    } else {
      if (currentFailures >= 2) {
        // PERDIDO -> Guardar y salir
        await markGameAsPlayed();
        router.replace({ pathname: '/games/atention/result', params: { score: score } });
      } else {
        if (level >= 9) {
          // GANADO (Max nivel) -> Guardar y salir
          await markGameAsPlayed();
          router.replace({ pathname: '/games/atention/result', params: { score: score + level * 10 } });
        } else {
          // SIGUIENTE NIVEL
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setTrial(1);
          setFailures(0);
          startRound(nextLevel);
        }
      }
    }
  };

  const animatedDigitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: digitScale.value }],
    opacity: digitOpacity.value,
  }));

  const animatedFeedbackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
    opacity: feedbackOpacity.value,
  }));

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={[globalStyles.iconButton, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.livesContainer}>
          <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16 }}>
            Nivel {level - 3} <Text style={{ color: theme.textSecondary, fontSize: 14 }}>(Longitud {level})</Text>
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {phase === 'presentation' ? (
          <View style={styles.presentationContainer}>
            <Text style={[styles.instructionText, { color: theme.textSecondary }]}>Memoriza...</Text>
            <Animated.View style={[styles.digitContainer, animatedDigitStyle]}>
              <Text style={[styles.digitText, { color: theme.primary }]}>
                {currentDigit !== null ? currentDigit : ''}
              </Text>
            </Animated.View>
          </View>
        ) : phase === 'feedback' ? (
          <View style={styles.feedbackContainer}>
            <Animated.View style={[styles.feedbackIconContainer, animatedFeedbackStyle]}>
              <MaterialIcons
                name={feedbackType === 'correct' ? 'check-circle' : 'cancel'}
                size={120}
                color={feedbackType === 'correct' ? theme.primary : theme.error}
              />
              <Text style={[styles.feedbackText, { color: feedbackType === 'correct' ? theme.primary : theme.error }]}>
                {feedbackType === 'correct' ? '¡Correcto!' : '¡Incorrecto!'}
              </Text>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={[styles.instructionText, { color: theme.textSecondary }]}>Repite la secuencia</Text>

            <View style={styles.slotsContainer}>
              {Array.from({ length: sequence.length }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.slot,
                    {
                      borderColor: userSequence[i] !== undefined ? theme.primary : theme.surface,
                      backgroundColor: theme.surface
                    }
                  ]}
                >
                  <Text style={[styles.slotText, { color: theme.text }]}>
                    {userSequence[i] !== undefined ? userSequence[i] : ''}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.keypad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.key, { backgroundColor: theme.surface }]}
                  onPress={() => handleInput(num)}
                >
                  <Text style={[styles.keyText, { color: theme.text }]}>{num}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.key} />
              <TouchableOpacity
                style={[styles.key, { backgroundColor: theme.surface }]}
                onPress={() => handleInput(0)}
              >
                <Text style={[styles.keyText, { color: theme.text }]}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.key, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
                onPress={handleBackspace}
              >
                <MaterialIcons name="backspace" size={24} color={theme.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  presentationContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 120,
    flex: 1,
  },
  feedbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  feedbackIconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 40,
  },
  digitContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontSize: 120,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  slot: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 360,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    fontSize: 32,
    fontWeight: '600',
  },
});