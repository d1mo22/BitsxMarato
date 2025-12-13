import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

export default function VerbalFluencyGame() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    border: isDark ? 'rgba(255,255,255,0.05)' : Colors.gray200,
    primary: Colors.primary,
  };

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.15, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      router.replace('/games/verbal-fluency/result');
    }
  }, [isActive, timeLeft]);

  const progress = (30 - timeLeft) / 30;
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference * progress;

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
        <Text style={[globalStyles.title, { color: theme.text }]}>Fluencia Verbal</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: theme.textSecondary, fontSize: 16, fontWeight: '500' }}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Turn Indicator */}
        <View style={[styles.turnIndicator, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e8edea' }]}>
          <View style={[styles.turnPill, { backgroundColor: theme.surface, shadowColor: "#000", shadowOpacity: 0.1, elevation: 2 }]}>
            <Text style={[styles.turnText, { color: theme.text, fontWeight: 'bold' }]}>Letra P</Text>
          </View>
          <View style={styles.turnPillInactive}>
            <Text style={[styles.turnText, { color: theme.textSecondary }]}>Animal</Text>
          </View>
        </View>

        {/* Central Interaction */}
        <View style={styles.centerContainer}>
          {/* Pulse Background */}
          <Animated.View style={[styles.pulseBackground, animatedPulseStyle, { backgroundColor: 'rgba(54, 226, 123, 0.2)' }]} />
          
          {/* Timer Ring */}
          <View style={styles.timerContainer}>
            <Svg width="256" height="256" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx="50"
                cy="50"
                r="46"
                stroke={isDark ? Colors.gray800 : Colors.gray200}
                strokeWidth="2"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="46"
                stroke={Colors.primary}
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>
            
            {/* Mic Button */}
            <TouchableOpacity style={styles.micButton}>
              <MaterialIcons name="mic" size={64} color="white" />
            </TouchableOpacity>
          </View>

          {/* Status Text */}
          <View style={styles.statusContainer}>
            <Text style={[styles.statusTitle, { color: theme.text }]}>Escuchando...</Text>
            <Text style={[styles.statusSubtitle, { color: theme.textSecondary }]}>
              Di una palabra que empiece con <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>P</Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Visualizer Hint */}
          <View style={styles.visualizer}>
            {[12, 20, 32, 16, 8].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h, backgroundColor: Colors.primary, opacity: 0.5 + (i%2)*0.5 }]} />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.pauseButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setIsActive(!isActive)}
          >
            <MaterialIcons name={isActive ? "pause" : "play-arrow"} size={24} color={theme.text} />
            <Text style={[styles.pauseText, { color: theme.text }]}>{isActive ? "Pausar prueba" : "Reanudar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },
  turnIndicator: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 9999,
    width: 280,
    height: 56,
    marginBottom: 32,
  },
  turnPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  turnPillInactive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnText: {
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pulseBackground: {
    position: 'absolute',
    width: 256,
      height: 256,
    marginTop: -95,
    borderRadius: 128,
  },
  timerContainer: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  statusContainer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusSubtitle: {
    fontSize: 18,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  pauseText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
