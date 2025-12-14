import React, { useState, useCallback } from 'react'; // Importar useState y useCallback
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router'; // Importar useFocusEffect
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

import { Colors } from '@/constants/colors';
import { globalStyles } from '@/styles/global';
import { useTheme } from '@/hooks/use-theme';

const GAME_ID = 'SORT_GAME_LAST_PLAYED'; // Identificador único para este juego

export default function SortGameInstructionScreen() {
    const router = useRouter();
    const { colors: theme, isDark } = useTheme();
    const [isLocked, setIsLocked] = useState(false); // Estado para controlar el bloqueo

    // Usamos useFocusEffect para verificar cada vez que la pantalla gana foco (cuando vuelves)
    useFocusEffect(
        useCallback(() => {
            checkAvailability();
        }, [])
    );

    const checkAvailability = async () => {
        try {
            const lastPlayedDate = await AsyncStorage.getItem(GAME_ID);
            const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

            if (lastPlayedDate === today) {
                setIsLocked(true);
            } else {
                setIsLocked(false);
            }
        } catch (error) {
            console.error('Error checking game availability:', error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[globalStyles.iconButton, { backgroundColor: theme.surface }]}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Illustration */}
                <View style={[styles.illustrationContainer, { backgroundColor: isDark ? 'rgba(54, 226, 123, 0.1)' : 'rgba(54, 226, 123, 0.05)' }]}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Kv7V3IVgUAgHKAZyUxClJ7XXm4eY2CH5PN3uQ8FiL_0CmvfDTPN_dYsqFzMOEzxEmSB864XPVAV68iGXn5dXsqPgHhoWbREPmYiLDejd3Le_DtTirRilLtFU1obNVlNsI0YAFJQXRbg7EixmYYJeRC8EUhPvLhqxaAVoYhsVUSeMekBveAo9gD9xPjVIruyF0hhbU2BDkeUCtZtEtO6YA6nbLlcF3g3ispqUm8inysM8ML0PypNb-WWBucD-OitR4KW9yYeNQ9o" }}
                        style={[
                            styles.illustrationImage, 
                            isLocked && { opacity: 0.5, tintColor: 'gray' } // Efecto visual extra si está bloqueado
                        ]}
                        resizeMode="contain"
                    />
                </View>

                {/* Typography */}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#1e293b' }]}>
                        {isLocked ? '¡Vuelve mañana!' : 'Toque Rápido'}
                    </Text>
                    <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#64748b' }]}>
                        {isLocked 
                            ? "Ya has completado tu sesión de hoy. Descansa y vuelve mañana para seguir mejorando."
                            : <Text>Encuentra y toca los <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>números en orden ascendente</Text> tan rápido como puedas <Text style={{ fontStyle: 'italic' }}>cómodamente</Text>.</Text>
                        }
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.startButton, 
                        isLocked && styles.startButtonDisabled // Aplicar estilo de bloqueado
                    ]}
                    onPress={() => router.push('/games/sort/game')}
                    disabled={isLocked} // Deshabilitar interacción
                >
                    <Text style={[styles.startButtonText, isLocked && { color: '#fff' }]}>
                        {isLocked ? 'Completado por hoy' : 'Comenzar'}
                    </Text>
                    <MaterialIcons 
                        name={isLocked ? "lock" : "arrow-forward"} 
                        size={20} 
                        color="#fff" 
                    />
                </TouchableOpacity>
                
                {!isLocked && (
                    <View style={styles.durationContainer}>
                        <MaterialIcons name="timer" size={16} color={isDark ? '#9ca3af' : '#64748b'} />
                        <Text style={[styles.durationText, { color: isDark ? '#9ca3af' : '#64748b' }]}>Duración estimada: 2 min</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
    },
    // ... (resto de tus estilos anteriores)
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    illustrationContainer: {
        width: '100%',
        maxWidth: 320,
        aspectRatio: 1,
        borderRadius: 40,
        padding: 32,
        marginBottom: 32,
        overflow: 'hidden',
    },
    illustrationImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        maxWidth: 320,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 28,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    // NUEVO ESTILO PARA EL BOTÓN DESHABILITADO
    startButtonDisabled: {
        backgroundColor: '#94a3b8', // Gris
        opacity: 0.7,
        shadowOpacity: 0,
        elevation: 0,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    durationText: {
        fontSize: 14,
    },
});