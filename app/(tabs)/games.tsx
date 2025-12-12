import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { styles } from '@/styles/games';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import GameCard from '../../components/game-card';

export default function GamesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    border: isDark ? 'rgba(255,255,255,0.05)' : Colors.gray100,
    icon: isDark ? Colors.white : Colors.gray800,
    buttonHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Top App Bar */}
      <View style={[styles.header, { backgroundColor: isDark ? 'rgba(17, 33, 23, 0.9)' : 'rgba(246, 248, 247, 0.9)' }]}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'transparent' }]}>
          <MaterialIcons name="arrow-back" size={28} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Gimnasio Cerebral</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: 'transparent' }]}>
          <MaterialIcons name="settings" size={28} color={theme.icon} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting & Context */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingTitle, { color: theme.text }]}>
            Hola, Ana. {'\n'}
            <Text style={[styles.greetingSubtitle, { color: theme.textSecondary }]}>
              Tómate un momento para ti.
            </Text>
          </Text>
        </View>

        {/* Daily Progress */}
        <View style={styles.progressSection}>
          <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>META DIARIA</Text>
                <Text style={[styles.progressValue, { color: isDark ? Colors.white : Colors.gray800 }]}>1/3 Juegos</Text>
              </View>
              <View style={styles.streakContainer}>
                <MaterialIcons name="local-fire-department" size={18} color={Colors.primary} />
                <Text style={styles.streakText}>Sigue así</Text>
              </View>
            </View>
            {/* Progress Bar */}
            <View style={[styles.progressBarContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : Colors.gray100 }]}>
              <View style={[styles.progressBarFill, { width: '33%' }]} />
            </View>
          </View>
        </View>

        {/* Games List */}
        <View style={styles.gamesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? Colors.white : Colors.gray800 }]}>Recomendados para hoy</Text>
          </View>

          <View style={styles.gamesList}>
            {/* Card 1: La Despensa */}
            <GameCard 
              theme={theme}
              isDark={isDark}
              title="La Despensa"
              duration="~1 min"
              description="Memoriza objetos cotidianos en un ambiente tranquilo."
              category="Memoria"
              categoryIcon="psychology"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCxBo_GbOjbdaBilc7v24VS8ceX82zZMyDis0LEmB4DXTK-5lHjBwG-xUV4I9PGiWG57aBbNeUb9Iuvnz7uOKc0dkG-3ls32jzJ6_H8yCkGsK1ajPnjsWiiB7Qvrzd_bQVZo0uwKuXQfP7rYwFxBLbROTnYM7xPsAgUKV-pysjM2q7jCCliiTy36EXtRjpm4CTrrPkczkUEDyavUTCRBX5d3WffpsRDP1cw5rO5-OT6uPkvv4O7pHDqaoTm2UQ-pG1vtSgzlk9-RY4"
              imageBgColor="#e8f5e9"
              imageDarkBgColor="#25382e"
            />

            {/* Card 2: El Semáforo Inverso */}
            <GameCard 
              theme={theme}
              isDark={isDark}
              title="El Semáforo Inverso"
              duration="~2 min"
              description="Control de impulsos suave. Detente en verde, avanza en rojo."
              category="Control"
              categoryIcon="touch-app"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuDrJ703BKFl2B6fvK-XYrcpMQU8wj3Gf_3DwsBpHcBTOCzK3bk2xppi9S3W38G9ejoCwl5TBeZJa_-4abxaTM_ZYmjM9wxH08GuzBiNfpIXsIUFt48-19Yhnz3FsaoOYcXnkTFW4fq9c-FttXtYgKIiYtJdC7_BnXkE18E44B-xyn58h9nBOem-3Fccw2OzphU5ROkuCdu8gyVwzySZTKTEn1Upx06sI0y9aNqfotJQ3WynNZzGSbDGDA56dsV3crEQwCQ6K3aOzes"
              imageBgColor="#fff3e0"
              imageDarkBgColor="#3d342b"
            />

            {/* Card 3: Cazador de Patrones */}
            <GameCard 
              theme={theme}
              isDark={isDark}
              title="Cazador de Patrones"
              duration="~3 min"
              description="Encuentra la armonía visual conectando formas similares."
              category="Atención"
              categoryIcon="visibility"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCfs65YP2SWyCnq5w7MITUCMpdqgBQ2tAHSYBtUju02IVjy6LjXnyqGi2G9biQqnGXbEpL7YOKU_GglUVNYWrnkbnBKhEhGz31JfjDP5lNCAj3je7fBQmnNKmesmVx-dh9_ZbgU5BJOU983xUsFYEGGRe33_JNQNgzo0E113TQlu4xAYLnz6NK4tE2uiHGHTqbYg_3iwLKuv-5P546aSaNll5H8DO5no3_gzRV0bg8cepEPVdwGpUQ-0Gbjzd9Jppstu7dMPPDy4bQ"
              imageBgColor="#e1f5fe"
              imageDarkBgColor="#203642"
            />

            {/* Card 4: N-Back del Bosque */}
            <GameCard 
              theme={theme}
              isDark={isDark}
              title="N-Back del Bosque"
              duration="~2 min"
              description="Ejercita tu memoria de trabajo recordando sonidos del bosque."
              category="Auditivo"
              categoryIcon="headphones"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBATzLEr38rOMDg1Ov4zobG6rITV3iProntxhNlugP17tilH-nQWYCzasg5QdgMPDlGNERfurCA_fz6uHwKak3qdTa1m1p5SBpPyHfZfNaVK0jebnecp7v6qQyPp068udxykn4dwGXwLy9Pvl0Qm21776n6q-RrADBcUrlahzP2dxK2yr0Opmm3AqPJE3JRwFnZRZvsndgu2ts19T6OAz59IKFLIOaiG0koOHHL9knICsmDVf-w_xVLaxhUdx5A8xpaH9FF7BTmSJ8"
              imageBgColor="#f3e5f5"
              imageDarkBgColor="#362738"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




