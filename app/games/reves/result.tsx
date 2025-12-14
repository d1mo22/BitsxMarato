import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SortGameResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // Recuperamos los parámetros enviados desde game.tsx
    const level = params.level ? parseInt(params.level as string) : 0;
    const timeInSeconds = params.time ? parseInt(params.time as string) : 0;
    const won = params.won === 'true';

    const { colors: theme, isDark } = useTheme();

    // Formatear tiempo MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                
                {/* Icono Principal */}
                <View style={[styles.iconContainer, { backgroundColor: won ? 'rgba(54, 226, 123, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                    <MaterialIcons 
                        name={won ? "emoji-events" : "sentiment-very-dissatisfied"} 
                        size={80} 
                        color={won ? theme.primary : theme.error} 
                    />
                </View>

                {/* Título */}
                <Text style={[styles.title, { color: theme.text }]}>
                    {won ? '¡Entrenamiento Completado!' : '¡Buen esfuerzo!'}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {won 
                        ? "Has completado todos los niveles de memoria." 
                        : "Has llegado lejos, sigue practicando para mejorar tu memoria."}
                </Text>

                {/* Tarjetas de Estadísticas */}
                <View style={styles.statsRow}>
                    {/* Nivel / Ronda */}
                    <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                        <MaterialIcons name="layers" size={24} color={theme.primary} style={{ marginBottom: 8 }} />
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ronda Alcanzada</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>Nivel {level - 1}</Text> 
                        {/* level - 1 para que sea más intuitivo si se considera nivel 1 como 2 dígitos */}
                        <Text style={{ fontSize: 12, color: theme.textSecondary }}>(Longitud {level})</Text>
                    </View>

                    {/* Tiempo */}
                    <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
                        <MaterialIcons name="timer" size={24} color={theme.primary} style={{ marginBottom: 8 }} />
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tiempo Total</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>{formatTime(timeInSeconds)}</Text>
                    </View>
                </View>

                {/* Botón Salir */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => router.dismissAll()}
                >
                    <Text style={styles.buttonText}>Volver al Menú</Text>
                    <MaterialIcons name="home" size={24} color={Colors.gray900} />
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
        padding: 24,
    },
    iconContainer: {
        marginBottom: 24,
        padding: 24,
        borderRadius: 9999,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: 300,
        lineHeight: 22,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        marginBottom: 48,
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0e1f15',
    },
});