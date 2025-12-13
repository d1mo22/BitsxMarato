import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const GRID_SIZE = 3;
const TOTAL_NUMBERS = 12;
const BUBBLE_SIZE = (width - 48 - (16 * (GRID_SIZE - 1))) / GRID_SIZE; // 48 padding, 16 gap

export default function SortGameScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [currentNumber, setCurrentNumber] = useState(1);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [wrongNumber, setWrongNumber] = useState<number | null>(null);

    // Generate shuffled numbers once
    const numbers = useMemo(() => {
        const nums = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
        // Simple shuffle
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        return nums;
    }, []);

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

    const handlePress = (number: number) => {
        if (isPaused) return;

        if (number === currentNumber) {
            if (currentNumber === TOTAL_NUMBERS) {
                // Game Over
                router.push({
                    pathname: '/games/sort/result',
                    params: { time: elapsedTime }
                });
            } else {
                setCurrentNumber(prev => prev + 1);
            }
        } else if (number > currentNumber) {
            // Wrong number feedback
            setWrongNumber(number);
            setTimeout(() => setWrongNumber(null), 500);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111921' : '#f6f7f8' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
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

            {/* Instructions */}
            <View style={styles.instructionContainer}>
                <View style={[styles.instructionBox, { backgroundColor: isDark ? 'rgba(26, 35, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)' }]}>
                    <Text style={[styles.instructionText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        Toca los números en orden ascendente
                    </Text>
                </View>
            </View>

            {/* Grid */}
            <View style={styles.gridContainer}>
                <View style={styles.grid}>
                    {numbers.map((num) => {
                        const isCompleted = num < currentNumber;
                        const isWrong = num === wrongNumber;
                        // const isNext = num === currentNumber; // Removed hint

                        return (
                            <TouchableOpacity
                                key={num}
                                activeOpacity={0.7}
                                onPress={() => handlePress(num)}
                                style={[
                                    styles.bubble,
                                    {
                                        width: BUBBLE_SIZE,
                                        height: BUBBLE_SIZE,
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

            {/* Footer Progress */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#1a232e' : '#fff' }]}>
                <View style={styles.progressInfo}>
                    <Text style={[styles.progressTitle, { color: isDark ? '#fff' : '#0f172a' }]}>Progreso</Text>
                    <Text style={[styles.progressSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        {currentNumber - 1} de {TOTAL_NUMBERS} completado
                    </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${((currentNumber - 1) / TOTAL_NUMBERS) * 100}%`, backgroundColor: Colors.primary }
                        ]}
                    />
                </View>
                <View style={styles.levelInfo}>
                    <Text style={styles.levelText}>Nivel 1</Text>
                    <Text style={styles.levelText}>Siguiente: Nivel 2</Text>
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
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
        maxWidth: 360,
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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.03,
        shadowRadius: 20,
        elevation: 10,
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