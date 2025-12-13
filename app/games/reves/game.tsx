import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RevesGameScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Game State
    const [input, setInput] = useState<string[]>(['9']); // Initial state matching the design
    const maxLength = 3; // Matching the 3 slots in design

    const handlePressNumber = (num: string) => {
        if (input.length < maxLength) {
            setInput([...input, num]);
        }
    };

    const handleBackspace = () => {
        setInput(input.slice(0, -1));
    };

    const handleConfirm = () => {
        router.push('/games/reves/result');
    };

    const renderInputSlots = () => {
        const slots = [];
        for (let i = 0; i < maxLength; i++) {
            const hasValue = i < input.length;
            const isActive = i === input.length;
            const value = hasValue ? input[i] : '';

            slots.push(
                <View
                    key={i}
                    style={[
                        styles.slot,
                        {
                            backgroundColor: isDark ? '#1e293b' : '#fff',
                            borderColor: isActive ? '#5142f0' : (hasValue ? '#5142f0' : 'transparent'),
                            borderWidth: 2,
                        },
                        isActive && styles.activeSlotRing
                    ]}
                >
                    {hasValue ? (
                        <Text style={[styles.slotText, { color: isDark ? '#fff' : '#1e293b' }]}>{value}</Text>
                    ) : isActive ? (
                        <View style={styles.cursor} />
                    ) : (
                        <View style={[styles.dot, { backgroundColor: isDark ? '#475569' : '#cbd5e1' }]} />
                    )}
                </View>
            );
        }
        return slots;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121022' : '#F2F0FF' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent' }]}
                >
                    <MaterialIcons name="close" size={24} color={isDark ? '#cbd5e1' : '#656189'} />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1e293b' }]}>Memoria de Trabajo</Text>
                    <Text style={[styles.headerSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>Dígitos Inversos</Text>
                </View>

                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent' }]}
                >
                    <MaterialIcons name="help-outline" size={24} color={isDark ? '#cbd5e1' : '#656189'} />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                    <Text style={[styles.progressLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>PROGRESO</Text>
                    <Text style={styles.progressValue}>2/5</Text>
                </View>
                <View style={[styles.track, { backgroundColor: isDark ? '#1e293b' : '#fff' }]}>
                    <View style={[styles.fill, { width: '40%' }]} />
                </View>
            </View>

            {/* Main Task Area */}
            <View style={styles.mainContent}>
                {/* Rule Badge */}
                <View style={[styles.ruleBadge, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.7)', borderColor: isDark ? '#334155' : 'rgba(255, 255, 255, 0.4)' }]}>
                    <MaterialIcons name="swap-horiz" size={20} color="#5142f0" />
                    <Text style={[styles.ruleText, { color: isDark ? '#e2e8f0' : '#475569' }]}>Regla: Orden Inverso</Text>
                </View>

                {/* Input Display */}
                <View style={styles.inputContainer}>
                    {/* Reverse Indicator */}
                    <View style={styles.reverseIndicator}>
                        <MaterialIcons name="reply" size={32} color="#5142f0" style={{ transform: [{ rotateY: '180deg' }] }} />
                        <Text style={styles.reverseText}>AQUÍ</Text>
                    </View>

                    <View style={styles.slotsContainer}>
                        {renderInputSlots()}
                    </View>
                </View>

                <Text style={[styles.instructionTitle, { color: isDark ? '#fff' : '#1e293b' }]}>
                    Ingresa los números{'\n'}
                    <Text style={{ color: '#5142f0' }}>al revés</Text>
                </Text>
            </View>

            {/* Keypad */}
            <View style={[styles.keypadContainer, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)', borderColor: isDark ? '#334155' : 'rgba(255, 255, 255, 0.5)' }]}>
                <View style={styles.keypadGrid}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePressNumber(num.toString())}
                            style={[styles.key, { backgroundColor: isDark ? '#1e293b' : '#fff', borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}
                        >
                            <Text style={[styles.keyText, { color: isDark ? '#f1f5f9' : '#334155' }]}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    {/* Empty space */}
                    <View />
                    {/* Zero */}
                    <TouchableOpacity
                        onPress={() => handlePressNumber('0')}
                        style={[styles.key, { backgroundColor: isDark ? '#1e293b' : '#fff', borderBottomColor: isDark ? '#334155' : '#f1f5f9' }]}
                    >
                        <Text style={[styles.keyText, { color: isDark ? '#f1f5f9' : '#334155' }]}>0</Text>
                    </TouchableOpacity>
                    {/* Backspace */}
                    <TouchableOpacity
                        onPress={handleBackspace}
                        style={styles.backspaceKey}
                    >
                        <MaterialIcons name="backspace" size={28} color={isDark ? '#64748b' : '#94a3b8'} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                >
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                    <MaterialIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
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
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '500',
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    progressValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5142f0',
    },
    track: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: '#5142f0',
        borderRadius: 4,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        marginTop: -32,
    },
    ruleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
        marginBottom: 32,
        shadowColor: '#5142f0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 2,
    },
    ruleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        width: '100%',
        maxWidth: 320,
        position: 'relative',
        marginBottom: 32,
    },
    reverseIndicator: {
        position: 'absolute',
        left: -16,
        top: '50%',
        transform: [{ translateY: -20 }, { translateX: -40 }],
        alignItems: 'center',
        opacity: 0.8,
    },
    reverseText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#5142f0',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    slotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    slot: {
        flex: 1,
        aspectRatio: 3 / 4,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5142f0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 2,
    },
    activeSlotRing: {
        shadowColor: '#5142f0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    slotText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    cursor: {
        width: 2,
        height: 32,
        backgroundColor: '#5142f0',
        borderRadius: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    instructionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 28,
    },
    keypadContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 1,
        padding: 24,
        paddingBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 40,
        elevation: 10,
    },
    keypadGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        maxWidth: 340,
        alignSelf: 'center',
        marginBottom: 24,
    },
    key: {
        width: '30%',
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    keyText: {
        fontSize: 24,
        fontWeight: '600',
    },
    backspaceKey: {
        width: '30%',
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButton: {
        width: '100%',
        maxWidth: 340,
        height: 56,
        backgroundColor: '#5142f0',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        gap: 8,
        shadowColor: '#5142f0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});