import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

export default function SortGameInstructionScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.backgroundLight }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <MaterialIcons name="close" size={28} color={isDark ? '#fff' : '#1e293b'} />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarFill} />
                </View>
                <View style={{ width: 48 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Illustration */}
                <View style={[styles.illustrationContainer, { backgroundColor: isDark ? 'rgba(54, 226, 123, 0.1)' : 'rgba(54, 226, 123, 0.05)' }]}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Kv7V3IVgUAgHKAZyUxClJ7XXm4eY2CH5PN3uQ8FiL_0CmvfDTPN_dYsqFzMOEzxEmSB864XPVAV68iGXn5dXsqPgHhoWbREPmYiLDejd3Le_DtTirRilLtFU1obNVlNsI0YAFJQXRbg7EixmYYJeRC8EUhPvLhqxaAVoYhsVUSeMekBveAo9gD9xPjVIruyF0hhbU2BDkeUCtZtEtO6YA6nbLlcF3g3ispqUm8inysM8ML0PypNb-WWBucD-OitR4KW9yYeNQ9o" }}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Typography */}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#1e293b' }]}>Toque Rápido</Text>
                    <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#64748b' }]}>
                        Encuentra y toca los números en orden del <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>1 al 10</Text> tan rápido como puedas <Text style={{ fontStyle: 'italic' }}>cómodamente</Text>.
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => router.push('/games/sort/game')}
                >
                    <Text style={styles.startButtonText}>Comenzar</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.durationContainer}>
                    <MaterialIcons name="timer" size={16} color={isDark ? '#9ca3af' : '#64748b'} />
                    <Text style={[styles.durationText, { color: isDark ? '#9ca3af' : '#64748b' }]}>Duración estimada: 2 min</Text>
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
        padding: 24,
    },
    closeButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
    progressBarContainer: {
        height: 4,
        width: 64,
        backgroundColor: 'rgba(54, 226, 123, 0.2)',
        borderRadius: 2,
    },
    progressBarFill: {
        height: '100%',
        width: '33%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
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