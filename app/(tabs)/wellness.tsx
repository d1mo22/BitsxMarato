import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WellnessScreen() {
    const { colors: theme, isDark } = useTheme();

    return (
        <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold' }}>Bienestar</Text>
            </View>
        </SafeAreaView>
    );
}
