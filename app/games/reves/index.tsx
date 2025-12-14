import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router'; // Importar useFocusEffect
import React, { useState, useCallback } from 'react'; // Importar hooks
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar

const GAME_ID = 'REVERSE_GAME_LAST_PLAYED'; // ID Único para este juego

export default function RevesInstructionScreen() {
    const router = useRouter();
    const { colors: baseTheme, isDark } = useTheme();
    const [isLocked, setIsLocked] = useState(false); // Estado de bloqueo

    const theme = {
        ...baseTheme,
        cardBg: baseTheme.surface,
        cardBorder: isDark ? '#2a4535' : '#eef4f0',
        slotBg: baseTheme.background,
    };

    // Verificar disponibilidad al entrar a la pantalla
    useFocusEffect(
        useCallback(() => {
            checkAvailability();
        }, [])
    );

    const checkAvailability = async () => {
        try {
            const lastPlayedDate = await AsyncStorage.getItem(GAME_ID);
            const today = new Date().toISOString().split('T')[0];
            setIsLocked(lastPlayedDate === today);
        } catch (error) {
            console.error('Error checking availability:', error);
        }
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Memoria de Trabajo</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Illustration */}
                <View style={styles.heroContainer}>
                    <View style={[
                        styles.heroCircle, 
                        { backgroundColor: isDark ? 'rgba(76, 230, 138, 0.1)' : 'rgba(76, 230, 138, 0.2)' },
                        isLocked && { backgroundColor: isDark ? '#334155' : '#e2e8f0' } // Gris si está bloqueado
                    ]}>
                        <MaterialIcons 
                            name={isLocked ? "lock" : "undo"} 
                            size={48} 
                            color={isLocked ? (isDark ? '#94a3b8' : '#64748b') : theme.primary} 
                        />
                    </View>
                </View>

                {/* Headline */}
                <Text style={[styles.title, { color: theme.text }]}>
                    {isLocked ? '¡Vuelve mañana!' : 'Recordar al Revés'}
                </Text>

                {/* Body Text */}
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    {isLocked 
                        ? "Has completado tu ejercicio de memoria por hoy. El descanso es parte fundamental del entrenamiento."
                        : <Text>¡Parte complicada! Observa los números, pero escríbelos <Text style={{ color: theme.primary, fontWeight: 'bold' }}>HACIA ATRÁS</Text>.</Text>
                    }
                </Text>

                {/* Example Card (Ocultamos o difuminamos si está bloqueado, opcionalmente) */}
                {!isLocked && (
                    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <View style={styles.cardSection}>
                            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>SI VES</Text>
                            <View style={styles.numberRow}>
                                <View style={[styles.numberBox, { backgroundColor: theme.slotBg }]}>
                                    <Text style={[styles.numberText, { color: theme.textSecondary }]}>1</Text>
                                </View>
                                <View style={[styles.numberBox, { backgroundColor: theme.slotBg }]}>
                                    <Text style={[styles.numberText, { color: theme.textSecondary }]}>2</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.arrowContainer}>
                            <MaterialIcons name="subdirectory-arrow-left" size={24} color={theme.primary} style={{ transform: [{ rotate: '90deg' }] }} />
                        </View>

                        <View style={styles.cardSection}>
                            <Text style={[styles.cardLabel, { color: theme.text }]}>ESCRIBE</Text>
                            <View style={styles.numberRow}>
                                <View style={[styles.numberBox, { backgroundColor: isDark ? 'rgba(76, 230, 138, 0.3)' : 'rgba(76, 230, 138, 0.2)', borderColor: theme.primary, borderWidth: 1 }]}>
                                    <Text style={[styles.numberText, { color: theme.text }]}>2</Text>
                                </View>
                                <View style={[styles.numberBox, { backgroundColor: isDark ? 'rgba(76, 230, 138, 0.3)' : 'rgba(76, 230, 138, 0.2)', borderColor: theme.primary, borderWidth: 1 }]}>
                                    <Text style={[styles.numberText, { color: theme.text }]}>1</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.cardFooter, { borderTopColor: theme.cardBorder }]}>
                            <Text style={[styles.footerText, { color: theme.textSecondary }]}>"Los últimos serán los primeros"</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.button, 
                        { backgroundColor: isLocked ? (isDark ? '#334155' : '#cbd5e1') : theme.primary } // Botón gris si bloqueado
                    ]}
                    onPress={() => router.push('/games/reves/game')}
                    disabled={isLocked}
                >
                    <Text style={[styles.buttonText, isLocked && { color: '#fff' }]}>
                        {isLocked ? 'Completado por hoy' : 'Comenzar'}
                    </Text>
                    <MaterialIcons 
                        name={isLocked ? "lock" : "play-arrow"} 
                        size={24} 
                        color={isLocked ? "#fff" : "#0e1f15"} 
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ... Tus estilos originales se mantienen igual
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    bar: {
        width: 32,
        height: 8,
        borderRadius: 4,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    heroContainer: {
        paddingVertical: 24,
    },
    heroCircle: {
        width: 128,
        height: 128,
        borderRadius: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        maxWidth: 300,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 16,
        borderWidth: 1,
        padding: 24,
        marginBottom: 24,
    },
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    numberRow: {
        flexDirection: 'row',
        gap: 8,
    },
    numberBox: {
        width: 32,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    arrowContainer: {
        alignItems: 'center',
        marginVertical: -8,
    },
    cardFooter: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    footer: {
        padding: 24,
    },
    button: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0e1f15',
    },
});