import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AttentionGame() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    primary: Colors.primary,
    error: '#ef4444',
  };

  const [level, setLevel] = useState(3); // Sequence length
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<'presentation' | 'input' | 'feedback'>('presentation');
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  // Animation values
  const digitScale = useSharedValue(0);
  const digitOpacity = useSharedValue(0);

  // Start game
  useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    const newSequence = Array.from({ length: level }, () => Math.floor(Math.random() * 10));
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('presentation');
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause before digit
      setCurrentDigit(seq[i]);
      digitScale.value = withSequence(withTiming(1.2, { duration: 200 }), withTiming(1, { duration: 200 }));
      digitOpacity.value = withTiming(1, { duration: 200 });
      
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

    if (newUserSequence.length === sequence.length) {
      checkSequence(newUserSequence);
    }
  };

  const handleBackspace = () => {
    if (phase !== 'input') return;
    setUserSequence(prev => prev.slice(0, -1));
  };

  const checkSequence = (input: number[]) => {
    const isCorrect = input.every((val, index) => val === sequence[index]);
    
    if (isCorrect) {
      setScore(prev => prev + level * 10);
      setLevel(prev => prev + 1);
      setTimeout(startRound, 1000);
    } else {
      setLives(prev => prev - 1);
      if (lives - 1 <= 0) {
        router.replace({ pathname: '/games/atention/result', params: { score: score + (level - 3) * 10 } });
      } else {
        // Retry same level with new sequence
        setTimeout(startRound, 1000);
      }
    }
  };

  const animatedDigitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: digitScale.value }],
    opacity: digitOpacity.value,
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
          {[...Array(3)].map((_, i) => (
            <MaterialIcons 
              key={i} 
              name="favorite" 
              size={24} 
              color={i < lives ? theme.primary : theme.surface} 
            />
          ))}
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
        ) : (
          <View style={styles.inputContainer}>
            <Text style={[styles.instructionText, { color: theme.textSecondary }]}>Repite la secuencia</Text>
            
            {/* Slots */}
            <View style={styles.slotsContainer}>
              {Array.from({ length: level }).map((_, i) => (
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
    justifyContent: 'center',
    flex: 1,
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
