import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar

import { Colors } from '@/constants/colors';

// ... (tus constantes GRID_SIZE, TOTAL_NUMBERS, etc. siguen igual)
const GRID_SIZE = 3;
const TOTAL_NUMBERS = 12;
const MAX_CONTENT_WIDTH = 400; 
const GAP = 16;
const PADDING = 24;
const GAME_ID = 'SORT_GAME_LAST_PLAYED'; // Mismo ID que en index

export default function SortGameScreen() {
    // ... (tus hooks y estados siguen igual)
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { width } = useWindowDimensions();

    const bubbleSize = useMemo(() => {
        const effectiveWidth = Math.min(width, MAX_CONTENT_WIDTH);
        const availableSpace = effectiveWidth - (PADDING * 2) - (GAP * (GRID_SIZE - 1));
        return availableSpace / GRID_SIZE;
    }, [width]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [wrongNumber, setWrongNumber] = useState<number | null>(null);

    // ... (tu lógica de generate numbers sigue igual)
    const { numbers, sortedNumbers } = useMemo(() => {
        const set = new Set<number>();
        while (set.size < TOTAL_NUMBERS) {
            set.add(Math.floor(Math.random() * 99) + 1);
        }
        const nums = Array.from(set);
        const sorted = [...nums].sort((a, b) => a - b);
        const shuffled = [...nums];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return { numbers: shuffled, sortedNumbers: sorted };
    }, []);

    const currentNumber = sortedNumbers[currentIndex];

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        if (startTime && !isPaused) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [startTime, isPaused]);

    // MODIFICAMOS handlePress PARA QUE SEA ASYNC Y GUARDE LA FECHA
    const handlePress = async (number: number) => {
        if (isPaused) return;

        if (number === currentNumber) {
            if (currentIndex === TOTAL_NUMBERS - 1) {
                // JUEGO TERMINADO
                try {
                    // Guardamos la fecha de hoy
                    const today = new Date().toISOString().split('T')[0];
                    await AsyncStorage.setItem(GAME_ID, today);
                } catch (e) {
                    console.error("Error saving game completion", e);
                }

                // Navegar a resultados
                router.push({
                    pathname: '/games/sort/result',
                    params: { time: elapsedTime }
                });
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        } else if (number > currentNumber) {
            setWrongNumber(number);
            setTimeout(() => setWrongNumber(null), 500);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // ... (El resto del renderizado es idéntico a tu versión anterior)
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111921' : '#f6f7f8' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { maxWidth: MAX_CONTENT_WIDTH, width: '100%', alignSelf: 'center' }]}>
                <TouchableOpacity
                    onPress={() => setIsPaused(!isPaused)}
                    style={[styles.iconButton, { backgroundColor: isDark ? '#1a232e' : '#fff' }]}
                >
                    <MaterialIcons name={isPaused ? "play-arrow" : "pause"} size={24} color={isDark ? '#cbd5e1' : '#475569'} />
                </TouchableOpacity>

                <Text style={[styles.timerText, { color: isDark ? '#fff' : '#0f172a' }]}>
                    {formatTime(elapsedTime)}
                </Text>

                <TouchableOpacity onPress={() => router.back()} style={styles.exitButton}>
                    <Text style={[styles.exitText, { color: isDark ? '#94a3b8' : '#64748b' }]}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.instructionContainer}>
                <View style={[styles.instructionBox, { backgroundColor: isDark ? 'rgba(26, 35, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)' }]}>
                    <Text style={[styles.instructionText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        Toca los números en orden ascendente
                    </Text>
                </View>
            </View>

            <View style={styles.gridContainer}>
                <View style={[styles.grid, { maxWidth: MAX_CONTENT_WIDTH }]}>
                    {numbers.map((num) => {
                        const isCompleted = num < currentNumber;
                        const isWrong = num === wrongNumber;

                        return (
                            <TouchableOpacity
                                key={num}
                                activeOpacity={0.7}
                                onPress={() => handlePress(num)}
                                style={[
                                    styles.bubble,
                                    {
                                        width: bubbleSize,
                                        height: bubbleSize,
                                        backgroundColor: isCompleted
                                            ? (isDark ? 'rgba(20, 83, 45, 0.1)' : 'rgba(232, 245, 233, 0.5)')
                                            : isWrong
                                                ? (isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(254, 226, 226, 0.5)')
                                                : (isDark ? '#1a232e' : '#fff'),
                                        borderColor: isCompleted
                                            ? (isDark ? 'rgba(20, 83, 45, 0.3)' : '#dcfce7')
                                            : isWrong
                                                ? (isDark ? 'rgba(239, 68, 68, 0.4)' : '#fecaca')
                                                : (isDark ? '#334155' : '#f1f5f9'),
                                        transform: [{ scale: isCompleted ? 0.95 : 1 }]
                                    }
                                ]}
                            >
                                {isCompleted ? (
                                    <>
                                        <Text style={[styles.bubbleText, { color: isDark ? 'rgba(74, 222, 128, 0.7)' : '#16a34a', textDecorationLine: 'line-through' }]}>
                                            {num}
                                        </Text>
                                        <View style={StyleSheet.absoluteFillObject}>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialIcons name="check" size={48} color="rgba(34, 197, 94, 0.3)" />
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <Text style={[
                                        styles.bubbleText,
                                        { color: isWrong ? (isDark ? '#f87171' : '#ef4444') : (isDark ? '#e2e8f0' : '#334155') }
                                    ]}>
                                        {num}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={{ width: '100%', alignItems: 'center', backgroundColor: isDark ? '#1a232e' : '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <View style={[styles.footer, { backgroundColor: 'transparent', width: '100%', maxWidth: MAX_CONTENT_WIDTH, shadowColor: 'transparent', elevation: 0 }]}>
                    <View style={styles.progressInfo}>
                        <Text style={[styles.progressTitle, { color: isDark ? '#fff' : '#0f172a' }]}>Progreso</Text>
                        <Text style={[styles.progressSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {currentIndex} de {TOTAL_NUMBERS} completado
                        </Text>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${(currentIndex / TOTAL_NUMBERS) * 100}%`, backgroundColor: Colors.primary }
                            ]}
                        />
                    </View>
                    <View style={styles.levelInfo}>
                        <Text style={styles.levelText}>Nivel 1</Text>
                        <Text style={styles.levelText}>Siguiente: Nivel 2</Text>
                    </View>
                </View>
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
        padding: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    exitButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    exitText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    instructionContainer: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        alignItems: 'center',
    },
    instructionBox: {
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    gridContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        width: '100%',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        justifyContent: 'center',
        width: '100%',
    },
    bubble: {
        borderRadius: 999,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    bubbleText: {
        fontSize: 32,
        fontWeight: '800',
    },
    footer: {
        padding: 24,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    progressBarBg: {
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 6,
    },
    levelInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    levelText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
});