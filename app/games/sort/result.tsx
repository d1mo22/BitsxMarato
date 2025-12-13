import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';

export default function SortGameResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const time = params.time ? parseInt(params.time as string) : 35; // Default or from params

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#112117' : '#f8fafc' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.dismissAll()}
                    style={[styles.closeButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9' }]}
                >
                    <MaterialIcons name="close" size={24} color={isDark ? '#fff' : '#1e293b'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1e293b' }]}>Resultados</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Success Message */}
                <View style={styles.successContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(54, 226, 123, 0.2)' }]}>
                        <MaterialIcons name="check-circle" size={32} color={isDark ? Colors.primary : '#4db676'} />
                    </View>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#1e293b' }]}>
                        Prueba de Velocidad{'\n'}Terminada
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        ¡Bien hecho! Has mantenido un excelente enfoque hoy.
                    </Text>
                </View>

                {/* Result Card */}
                <View style={[styles.resultCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f0fdf4', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(54, 226, 123, 0.1)' }]}>
                    <Text style={[styles.cardLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>TU TIEMPO</Text>
                    <View style={styles.timeContainer}>
                        <Text style={[styles.timeValue, { color: isDark ? '#fff' : '#1e293b' }]}>{time}</Text>
                        <Text style={[styles.timeUnit, { color: isDark ? '#94a3b8' : '#64748b' }]}>s</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
                        <MaterialIcons name="trending-up" size={16} color={Colors.primary} />
                        <Text style={[styles.badgeText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>+2s vs promedio</Text>
                    </View>
                </View>

                {/* Chart Section */}
                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <Text style={[styles.chartTitle, { color: isDark ? '#fff' : '#1e293b' }]}>Progreso semanal</Text>
                        <View style={[styles.averageBadge, { backgroundColor: 'rgba(54, 226, 123, 0.1)' }]}>
                            <Text style={[styles.averageText, { color: isDark ? Colors.primary : '#4db676' }]}>Promedio: 38s</Text>
                        </View>
                    </View>

                    <View style={[styles.chartContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
                        <View style={{ height: 140, width: '100%' }}>
                            <Svg height="100%" width="100%" viewBox="0 0 350 120" preserveAspectRatio="none">
                                <Defs>
                                    <LinearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.3" />
                                        <Stop offset="1" stopColor={Colors.primary} stopOpacity="0" />
                                    </LinearGradient>
                                </Defs>
                                <Path
                                    d="M0,80 C50,80 50,40 100,50 C150,60 150,90 200,70 C250,50 250,30 300,40 C325,45 350,20 350,20 L350,120 L0,120 Z"
                                    fill="url(#gradientFill)"
                                />
                                <Path
                                    d="M0,80 C50,80 50,40 100,50 C150,60 150,90 200,70 C250,50 250,30 300,40 C325,45 350,20 350,20"
                                    fill="none"
                                    stroke={Colors.primary}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <Circle cx="350" cy="20" r="6" fill={isDark ? '#fff' : '#1e293b'} />
                                <Circle cx="350" cy="20" r="12" fill="none" stroke={Colors.primary} strokeWidth="2" opacity="0.5" />
                            </Svg>
                        </View>

                        {/* Days Labels */}
                        <View style={styles.daysContainer}>
                            {['L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
                                <Text key={index} style={styles.dayText}>{day}</Text>
                            ))}
                            <View style={styles.activeDay}>
                                <Text style={[styles.activeDayText, { color: isDark ? '#fff' : '#1e293b' }]}>D</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#112117' : '#fff', borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }]}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => router.dismissAll()}
                >
                    <Text style={styles.saveButtonText}>Guardar y Salir</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#1e293b" />
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
        paddingTop: 24,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 32,
    },
    successContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        maxWidth: 280,
    },
    resultCard: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    timeValue: {
        fontSize: 60,
        fontWeight: '800',
        lineHeight: 60,
    },
    timeUnit: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    chartSection: {
        flex: 1,
        gap: 16,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    averageBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    averageText: {
        fontSize: 14,
        fontWeight: '600',
    },
    chartContainer: {
        flex: 1,
        borderRadius: 24,
        borderWidth: 1,
        padding: 16,
        minHeight: 220,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    dayText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94a3b8',
    },
    activeDay: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(54, 226, 123, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDayText: {
        fontSize: 12,
        fontWeight: '800',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
    },
    saveButton: {
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
});