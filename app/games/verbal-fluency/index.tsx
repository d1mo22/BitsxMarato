import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerbalFluencyIntro() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    border: isDark ? 'rgba(255,255,255,0.05)' : Colors.gray200,
    primary: Colors.primary,
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={globalStyles.header}>
        <TouchableOpacity 
          style={[globalStyles.iconButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[globalStyles.title, { color: theme.text, opacity: 0.8 }]}>Fluencia Verbal</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={globalStyles.scrollView} 
        contentContainerStyle={[globalStyles.scrollContent, { paddingHorizontal: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Illustration */}
        <View style={styles.heroContainer}>
          <View style={[styles.heroCircle, { backgroundColor: isDark ? '#1a332a' : '#e0f7fa', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)' }]}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-UpuOzWTkW1C_I6I3xCbOVtiM20W-7rDITIGc_xopOCBCHlxI-Vzgpv3UE44BD_d5fM-uHsDbI499SK_48sFUqChytwK-is9jdjFUPwPlqksEMXmeaCXRhYDEIl8Nxl_ymwsxAUim5ZhakxluCoNLsoBmSXXr9qkSbrUe637X6PL2i4Cvzmsm324mZGYVx3ju4PQvbXWPskfffuTZAwqZQZNtiDyTYcyMfU0ywBa-LCTKHK9nOrF0B5oj0CRVr9mYiDxn0YlTAe0" }} 
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineContainer}>
          <Text style={[globalStyles.title, { color: theme.text, textAlign: 'center', fontSize: 32 }]}>
            Cambio de Palabras
          </Text>
          <View style={styles.divider} />
        </View>

        {/* Instructions Card */}
        <View style={[globalStyles.card, { backgroundColor: theme.surface, borderColor: theme.border, padding: 24 }]}>
          <View style={styles.instructionHeader}>
            <View style={styles.iconBadge}>
              <MaterialIcons name="psychology" size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.instructionTitle, { color: theme.text }]}>Instrucciones</Text>
          </View>
          
          <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
            Reto Alterno: Di una palabra que empiece con <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>P</Text>, luego un nombre de Animal.
          </Text>
          <Text style={[styles.instructionText, { color: theme.textSecondary, marginTop: 12 }]}>
            ¡Sigue alternando lo más rápido que puedas!
          </Text>
        </View>

        {/* Example Visual */}
        <View style={[styles.exampleContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(54, 226, 123, 0.05)', borderColor: theme.border }]}>
          <Text style={[styles.exampleLabel, { color: isDark ? '#8baaa0' : '#648775' }]}>EJEMPLO VISUAL</Text>
          <View style={styles.exampleFlow}>
            <View style={[styles.exampleTag, { backgroundColor: theme.surface }]}>
              <Text style={[styles.exampleTagText, { color: theme.text }]}>Pera</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
            <View style={[styles.exampleTag, { backgroundColor: theme.surface }]}>
              <Text style={[styles.exampleTagText, { color: theme.text }]}>Perro</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.primary} />
            <View style={[styles.exampleTag, { backgroundColor: theme.surface }]}>
              <Text style={[styles.exampleTagText, { color: theme.text }]}>Papel</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/games/verbal-fluency/game')}
        >
          <Text style={styles.startButtonText}>Empezar</Text>
          <MaterialIcons name="play-circle" size={24} color="#022c22" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  heroCircle: {
    width: 256,
    height: 256,
    borderRadius: 128,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    height: 4,
    width: 64,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 8,
    opacity: 0.5,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBadge: {
    backgroundColor: 'rgba(54, 226, 123, 0.2)',
    padding: 8,
    borderRadius: 9999,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  exampleContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  exampleFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exampleTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exampleTagText: {
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
  startButton: {
    backgroundColor: Colors.primary,
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonText: {
    color: '#022c22',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
