import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AttentionIntro() {
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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={globalStyles.header}>
        <TouchableOpacity 
          style={[globalStyles.iconButton, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textSecondary }]}>ATENCIÓN</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Escucha y Repite</Text>
        </View>

        {/* Illustration Placeholder */}
        <View style={[styles.illustrationContainer, { backgroundColor: theme.surface }]}>
          <MaterialIcons name="memory" size={80} color={theme.primary} style={{ opacity: 0.8 }} />
          <View style={[styles.blob, { backgroundColor: theme.primary, opacity: 0.1 }]} />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.text }]}>
            Observa los números aparecer, luego escríbelos en el <Text style={{ color: theme.primary, fontWeight: 'bold' }}>MISMO</Text> orden exacto.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            onPress={() => router.push('/games/atention/game')}
          >
            <Text style={styles.buttonText}>Listo</Text>
            <MaterialIcons name="arrow-forward" size={24} color={Colors.gray900} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
  },
  descriptionContainer: {
    marginBottom: 40,
    width: '100%',
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
  },
  button: {
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray900,
  },
});
