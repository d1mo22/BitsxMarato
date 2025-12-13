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

export default function ReverseSortGame() {
  const router = useRouter();
  const { colors: theme, isDark } = useTheme();

  // --- CONFIGURACIÓN DEL JUEGO ---
  const START_LEVEL = 2; // Longitud inicial
  const MAX_LEVEL = 8;   // Longitud máxima

  const [level, setLevel] = useState(START_LEVEL); 
  const [trial, setTrial] = useState(1); // 1 o 2
  const [failures, setFailures] = useState(0); // Fallos acumulados en el nivel actual
  
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

  // Start game
  useEffect(() => {
    startRound(START_LEVEL);
  }, []);

  useEffect(() => {
    return () => {
      try {
        Speech.stop();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const startRound = (currentLevel = level) => {
    // Generamos números aleatorios del 0 al 9
    const newSequence = Array.from({ length: currentLevel }, () => Math.floor(Math.random() * 10));
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('presentation');
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Pause before start

    for (let i = 0; i < seq.length; i++) {
      setCurrentDigit(seq[i]);

      // Start animation
      digitScale.value = withSequence(withTiming(1.2, { duration: 200 }), withTiming(1, { duration: 200 }));
      digitOpacity.value = withTiming(1, { duration: 200 });

      // Speak immediately
      try {
        Speech.speak(String(seq[i]), {
          language: 'es-US',
          rate: 1.1
        });
      } catch (e) {
        // ignore
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Show digit

      digitOpacity.value = withTiming(0, { duration: 200 });
      await new Promise(resolve => setTimeout(resolve, 200)); // Fade out
      setCurrentDigit(null);
    }
    setPhase('input');
  };

  const handleInput = (num: number) => {
    if (phase !== 'input') return;

    const newUserSequence = [...userSequence, num];
    setUserSequence(newUserSequence);

    // Comprobar automáticamente cuando se completa la longitud
    if (newUserSequence.length === sequence.length) {
      checkSequence(newUserSequence);
    }
  };

  const handleBackspace = () => {
    if (phase !== 'input') return;
    setUserSequence(prev => prev.slice(0, -1));
  };

  const checkSequence = async (input: number[]) => {
    // LÓGICA INVERSA: Comparamos la entrada con la secuencia al revés
    const target = [...sequence].reverse();
    const isCorrect = input.every((val, index) => val === target[index]);

    // Update failures count for this level logic
    const currentFailures = isCorrect ? failures : failures + 1;
    // (Nota: no seteamos failures aquí inmediatamente para no afectar lógica asíncrona, usamos variable local)

    // Show feedback
    setPhase('feedback');
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');

    // Animate feedback icon
    feedbackScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.3, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );
    feedbackOpacity.value = withTiming(1, { duration: 300 });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Fade out feedback
    feedbackOpacity.value = withTiming(0, { duration: 300 });
    await new Promise(resolve => setTimeout(resolve, 300));

    if (isCorrect) {
      setScore(prev => prev + level * 100);
    }

    // --- GAME LOGIC (Progresión Estricta) ---
    
    if (trial === 1) {
      // Si estamos en la serie 1, pasamos SIEMPRE a la serie 2 del mismo nivel
      // Guardamos si hubo fallo
      if (!isCorrect) setFailures(failures + 1);
      
      setTrial(2);
      startRound(level);
    } else {
      // Estamos al final de la serie 2. Evaluamos el nivel completo.
      // Calculamos fallos totales: los que traíamos + el actual si falló
      const totalFailures = failures + (isCorrect ? 0 : 1);

      if (totalFailures >= 2) {
        // Falló las dos series (o falló 2 veces en total) -> GAME OVER
        router.replace({ 
            pathname: '/games/sort/result', // Ajusta esta ruta a tu pantalla de resultados
            params: { won: 'false', level: level, score: score, reason: 'failed_level' } 
        });
      } else {
        // Pasó al menos una serie -> SIGUIENTE NIVEL
        if (level >= MAX_LEVEL) {
          // Juego completado
          router.replace({ 
            pathname: '/games/sort/result', 
            params: { won: 'true', level: level, score: score + (level * 100) } 
          });
        } else {
          // Next level
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
            Nivel {level - START_LEVEL + 1} <Text style={{ color: theme.textSecondary, fontSize: 14 }}>(Longitud {level})</Text>
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
              {feedbackType === 'incorrect' && (
                <Text style={{ color: theme.textSecondary, marginTop: 10, fontSize: 16 }}>
                    Era: {[...sequence].reverse().join(' - ')}
                </Text>
              )}
            </Animated.View>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                Escribe en orden <Text style={{color: theme.error, fontWeight: 'bold'}}>INVERSO</Text>
            </Text>

            {/* Slots */}
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

            {/* Keypad */}
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
              
              {/* Espacio vacío para centrar el 0 */}
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