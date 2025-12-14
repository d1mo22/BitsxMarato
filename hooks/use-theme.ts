import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

export function useTheme() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return {
        isDark,
        colors: {
            background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
            text: isDark ? Colors.white : Colors.gray900,
            textSecondary: isDark ? Colors.gray300 : Colors.gray400,
            surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
            primary: Colors.primary,
            error: '#ef4444',
            white: Colors.white,
            gray100: Colors.gray100,
            gray200: Colors.gray200,
            gray300: Colors.gray300,
            gray400: Colors.gray400,
            gray500: Colors.gray500,
            gray600: Colors.gray600,
            gray800: Colors.gray800,
            gray900: Colors.gray900,
            gray250: Colors.gray250,
            icon: isDark ? Colors.gray400 : Colors.gray500,
            border: isDark ? Colors.gray250 : Colors.gray200,
            active: Colors.primary,
        }
    };
}
