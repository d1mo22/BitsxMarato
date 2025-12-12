import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerbalFluencyResult() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    primary: Colors.primary,
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={globalStyles.header}>
        <TouchableOpacity 
          style={[globalStyles.iconButton, { backgroundColor: 'transparent' }]}
          onPress={() => router.dismissTo('/games')}
        >
          <MaterialIcons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Success Icon */}
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
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.dismissTo('/games')}
        >
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
    marginBottom: 32,
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
