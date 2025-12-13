import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RevesInstructionScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const theme = {
        background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
        text: isDark ? Colors.white : Colors.gray900,
        textSecondary: isDark ? Colors.gray400 : Colors.gray500,
        surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
        primary: Colors.primary,
        border: isDark ? 'rgba(255,255,255,0.1)' : Colors.gray200,
        cardBg: isDark ? '#1c2e24' : Colors.white,
        cardBorder: isDark ? '#2a4535' : '#eef4f0',
        slotBg: isDark ? '#112118' : '#f6f8f7',
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

            {/* Progress Indicators */}
            <View style={styles.progressContainer}>
                <View style={[styles.dot, { backgroundColor: theme.border }]} />
                <View style={[styles.bar, { backgroundColor: theme.primary }]} />
                <View style={[styles.dot, { backgroundColor: theme.border }]} />
                <View style={[styles.dot, { backgroundColor: theme.border }]} />
                <View style={[styles.dot, { backgroundColor: theme.border }]} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Illustration */}
                <View style={styles.heroContainer}>
                    <View style={[styles.heroCircle, { backgroundColor: isDark ? 'rgba(76, 230, 138, 0.1)' : 'rgba(76, 230, 138, 0.2)' }]}>
                        <MaterialIcons name="undo" size={48} color={theme.primary} />
                    </View>
                </View>

                {/* Headline */}
                <Text style={[styles.title, { color: theme.text }]}>
                    Recordar al Revés
                </Text>

                {/* Body Text */}
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                    ¡Parte complicada! Observa los números, pero escríbelos <Text style={{ color: theme.primary, fontWeight: 'bold' }}>HACIA ATRÁS</Text>.
                </Text>

                {/* Example Card */}
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
            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('/games/reves/game')}
                >
                    <Text style={styles.buttonText}>Comenzar</Text>
                    <MaterialIcons name="play-arrow" size={24} color="#0e1f15" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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