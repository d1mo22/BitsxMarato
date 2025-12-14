import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { colors: theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const customTheme = {
    background: theme.surface,
    border: theme.border,
    text: isDark ? Colors.gray500 : Colors.gray400,
    active: Colors.primary,
  };

  return (
    <View style={[styles.tabBar, {
      backgroundColor: customTheme.background,
      borderTopColor: customTheme.border,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 10
    }]}>
      <View style={styles.tabBarContent}>
        {state.routes
          .filter((route: any) => route.name !== 'progress')
          .map((route: any, index: number) => {
            const { options } = descriptors[route.key];

            // Skip hidden routes
            if (options.href === null) return null;

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            let iconName: keyof typeof MaterialIcons.glyphMap = 'circle';
            if (route.name === 'index') iconName = 'home';
            else if (route.name === 'games') iconName = 'sports-esports';
            else if (route.name === 'wellness') iconName = 'spa';
            else if (route.name === 'form') iconName = 'assignment';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
              >
                <MaterialIcons
                  name={iconName}
                  size={24}
                  color={isFocused ? theme.active : theme.text}
                />
                <Text style={[styles.tabLabel, { color: isFocused ? theme.active : theme.text }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="games" options={{ title: 'Juegos' }} />
      <Tabs.Screen name="form" options={{ title: 'Form' }} />
      <Tabs.Screen name="wellness" options={{ title: 'Bienestar' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 40,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 512,
    alignSelf: 'center',
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});
