import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const theme = {
    background: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    border: isDark ? 'rgba(255,255,255,0.05)' : Colors.gray200,
    text: isDark ? Colors.gray500 : Colors.gray400,
    active: Colors.primary,
  };

  return (
    <View style={[styles.tabBar, { 
      backgroundColor: theme.background, 
      borderTopColor: theme.border,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 10
    }]}>
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
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
          else if (route.name === 'games') iconName = 'fitness-center';
          else if (route.name === 'progress') iconName = 'bar-chart';
          else if (route.name === 'profile') iconName = 'person';

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
      <Tabs.Screen name="games" options={{ title: 'Gimnasio' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progreso' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
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
