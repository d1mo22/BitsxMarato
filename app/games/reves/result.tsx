import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function RevesResultScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#191121' : '#fcfbfe' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.dismissAll()}
                    style={[styles.closeButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent' }]}
                >
                    <MaterialIcons name="close" size={32} color={isDark ? '#fff' : '#2d2438'} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Brain Visual with Glow */}
                <View style={styles.visualContainer}>
                    {/* Outer Glow */}
                    <View style={[styles.glowCircle, { backgroundColor: isDark ? 'rgba(153, 71, 235, 0.3)' : 'rgba(153, 71, 235, 0.2)' }]} />

                    {/* Icon Container */}
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: 'rgba(153, 71, 235, 0.1)' }]}>
                        <MaterialIcons name="psychology" size={100} color="#9947eb" />
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#2d2438' }]}>
                        Memoria Actualizada
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#d1d5db' : '#6b6376' }]}>
                        ¡Esa fue difícil, buen trabajo!
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.finishButton}
                    onPress={() => router.dismissAll()}
                >
                    <Text style={styles.finishButtonText}>Finalizar</Text>
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
        padding: 24,
        paddingBottom: 8,
    },
    closeButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        marginTop: -40,
    },
    visualContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        width: 240,
        height: 240,
    },
    glowCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        transform: [{ scale: 1.5 }],
    },
    iconContainer: {
        width: 192,
        height: 192,
        borderRadius: 96,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#9947eb',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 60,
        elevation: 10,
    },
    textContainer: {
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
    },
    footer: {
        padding: 24,
        paddingBottom: 48,
    },
    finishButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#9947eb',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#9947eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    finishButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});