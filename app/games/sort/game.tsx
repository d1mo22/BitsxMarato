import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';


const GRID_SIZE = 3;
const TOTAL_NUMBERS = 12;
const MAX_CONTENT_WIDTH = 400;
const GAP = 16;
const PADDING = 24;
const GAME_ID = 'SORT_GAME_LAST_PLAYED';

export default function SortGameScreen() {
    const router = useRouter();
    const { colors: theme, isDark } = useTheme();
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

    const handlePress = async (number: number) => {
        if (isPaused) return;

        if (number === currentNumber) {
            if (currentIndex === TOTAL_NUMBERS - 1) {
                try {
                    const today = new Date().toISOString().split('T')[0];
                    await AsyncStorage.setItem(GAME_ID, today);
                } catch (e) {
                    console.error("Error saving game completion", e);
                }

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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { maxWidth: MAX_CONTENT_WIDTH, width: '100%', alignSelf: 'center' }]}>
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
                    <Text style={[styles.timerText, { color: theme.text }]}>
                        {formatTime(elapsedTime)}
                    </Text>
                </View>

                <View />

                <TouchableOpacity onPress={() => router.back()} style={styles.exitButton}>
                    <Text style={[styles.exitText, { color: theme.textSecondary }]}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.instructionContainer}>
                <View style={[styles.instructionBox, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}>
                    <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
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
                                                : theme.surface,
                                        borderColor: isCompleted
                                            ? (isDark ? 'rgba(20, 83, 45, 0.3)' : '#dcfce7')
                                            : isWrong
                                                ? (isDark ? 'rgba(239, 68, 68, 0.4)' : '#fecaca')
                                                : theme.border,
                                        transform: [{ scale: isCompleted ? 0.95 : 1 }]
                                    }
                                ]}
                            >
                                {isCompleted ? (
                                    <>
                                        <Text style={[styles.bubbleText, { color: theme.primary, textDecorationLine: 'line-through' }]}>
                                            {num}
                                        </Text>
                                        <View style={StyleSheet.absoluteFillObject}>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialIcons name="check" size={48} color={theme.primary} style={{ opacity: 0.3 }} />
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <Text style={[
                                        styles.bubbleText,
                                        { color: isWrong ? theme.error : theme.text }
                                    ]}>
                                        {num}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
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