import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, LayoutChangeEvent, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [chartWidth, setChartWidth] = useState(0);
  
  const theme = {
    background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
    text: isDark ? Colors.white : Colors.gray900,
    textSecondary: isDark ? Colors.gray400 : Colors.gray500,
    surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
    border: isDark ? 'rgba(255,255,255,0.05)' : Colors.gray100,
    icon: isDark ? Colors.gray400 : Colors.gray500,
  };

  const onLayoutChart = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width !== chartWidth) {
      requestAnimationFrame(() => {
        setChartWidth(width);
      });
    }
  };

  // Calculate path based on width
  // Original path: M0 80 C 50 80, 80 40, 130 50 S 200 80, 250 60 S 320 20, 400 10
  // We scale the X coordinates by (width / 400)
  const getPath = (width: number) => {
    if (width === 0) return "";
    const s = width / 400;
    return `M0 80 C ${50*s} 80, ${80*s} 40, ${130*s} 50 S ${200*s} 80, ${250*s} 60 S ${320*s} 20, ${400*s} 10`;
  };

  const getAreaPath = (width: number) => {
    if (width === 0) return "";
    const path = getPath(width);
    return `${path} V 120 H 0 Z`;
  };

  const s = chartWidth / 400;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.gray100 }]}>
              <MaterialIcons name="menu" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.gray100 }]}>
              <MaterialIcons name="notifications" size={24} color={theme.text} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU5aans5kKgEKtbI2iEB3q5A59JcIfkXcQhojsIGbA_rAyGHac-260pA0mebPIcj0qEMLgbmTpAN_Cd04iMVBCrimt9BBX1qfeCMdp0hdmwWwe3y8FhcyItMrm_VGJaDs7Jfg7gXTKWARZ7ydeL3pxXJIZCxlhnAVZ_btJg-e0qbPfZ3_lOdm6giOJb_3KCvH4DaVFVXLftVAmzh9Om8i9WsSq-2QuGItM1LoXnPpZ_nNH6EGReUMsEBDULwjtsMcwRp71zpl7rvk" }} 
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Hola, Ana.{'\n'}</Text>
          <Text style={[styles.title, { color: Colors.gray400 }]}>¿Cómo te sientes hoy?</Text>
        </View>

        {/* Trend Chart Widget */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>Salud Cognitiva</Text>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Mejorando</Text>
              </View>
              <View style={styles.trendContainer}>
                <View style={styles.trendBadge}>
                  <MaterialIcons name="trending-up" size={16} color={Colors.primary} />
                  <Text style={styles.trendText}>+5%</Text>
                </View>
                <Text style={styles.trendLabel}>Esta semana</Text>
              </View>
            </View>

            {/* Chart Area */}
            <View style={styles.chartContainer} onLayout={onLayoutChart}>
              {chartWidth > 0 && (
                <Svg height="100%" width="100%">
                  <Defs>
                    <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#36e27b" stopOpacity="0.2" />
                      <Stop offset="100%" stopColor="#36e27b" stopOpacity="0" />
                    </LinearGradient>
                  </Defs>
                  <Path 
                    d={getPath(chartWidth)} 
                    fill="none" 
                    stroke="#36e27b" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                  <Path 
                    d={getAreaPath(chartWidth)} 
                    fill="url(#chartGradient)" 
                    stroke="none"
                  />
                  <Circle cx={130 * s} cy="50" r="4" fill={theme.surface} stroke={Colors.primary} strokeWidth="2" />
                  <Circle cx={250 * s} cy="60" r="4" fill={theme.surface} stroke={Colors.primary} strokeWidth="2" />
                  <Circle cx={400 * s} cy="10" r="5" fill={Colors.primary} stroke={isDark ? theme.surface : Colors.white} strokeWidth="2" />
                </Svg>
              )}
            </View>

            <View style={styles.daysContainer}>
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
                <Text key={index} style={[styles.dayText, { color: index === 6 ? (isDark ? Colors.white : Colors.gray900) : Colors.gray400 }]}>
                  {day}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Activities Section */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Para hoy</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>

            {/* Card 1: Atención (Juego) */}
            <ActivityCard
              theme={theme}
              isDark={isDark}
              title="Atención"
              subtitle="Concentración • 2 min"
              icon="hearing"
              subIcon="psychology"
              imageUri="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
              bgColor="rgba(255, 251, 235, 1)" // yellow-50
              darkBgColor="rgba(113, 63, 18, 0.2)" // yellow-900/20
              onPress={() => router.push('/challenges/atentionGame')}
            />

            {/* Card 2: Focus */}
            <ActivityCard 
              theme={theme}
              isDark={isDark}
              title="Rompecabezas"
              subtitle="Estimulación • 3 min"
              icon="extension"
              subIcon="visibility"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuA9qO7-Gn85dh2fsh11RqxGm7EXuOxzncbRaelCMuuc77XUaHDThwzortnnBuNm26mzMYnse9fZ24mBYfk2a6nZAKHdeao_qTGtFeHudu-CRhNn3kfKsSXSGp6iW2MpVBY0-F6aHcUpVnxU-n7B_5wO-Eoox6p2Le7katb0TmLnAtcdka_MC0FUogEHPrpWc6NDsmeanGuhd7uWk3K4zVuCDACSXyErfQRW4rvOb-9yQTAEo_-QDRa6muxlI7zg42ak15lOQSZmFYM"
              bgColor="rgba(224, 231, 255, 1)" // indigo-100
              darkBgColor="rgba(49, 46, 129, 0.2)" // indigo-900/20
            />

            {/* Card 2: Breathing */}
            <ActivityCard 
              theme={theme}
              isDark={isDark}
              title="Respiración Guiada"
              subtitle="Calma • 2 min"
              icon="air"
              subIcon="self-improvement"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuDNSnyPWUISWvUlZyBSeg5As0kthqO3YazML2sXEL7cd6urod2hxHOjbIK8Vh9uBul5ncc-4Uh6ozlPaBSDzhXOEVTdLPj1FzbVruzITvW3GiYSVeBRFyZUbqSFOLcg-c_GEDHUDvav3gLPsXfq7mSITb0PnJALsCiCDTw5udjAoXiwcZzsMukj6QMz6yyBftdPjLPc1IcQ7yUe-cEHixgT6CYEiO4SPyvjW5V8FicwGGKjoN_wAuZkLwhqFz9FnOVfDnTd3sSMkIE"
              bgColor="rgba(204, 251, 241, 1)" // teal-100
              darkBgColor="rgba(19, 78, 74, 0.2)" // teal-900/20
            />

            {/* Card 3: Memory */}
            <ActivityCard 
              theme={theme}
              isDark={isDark}
              title="Asociación"
              subtitle="Memoria • 5 min"
              icon="psychology"
              subIcon="bolt"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuCu-fTt73RaenaBqqxzc37qMoFaoJMIfdpLOZvSDn6KXaY6OweIaKJWSBwHyrP8ykZvIqP3LQaOLZq7KMHrHM4YGUw7RMxoU6Cau9b0bXdEfCVbjzr9MYVVEr02iie_eL2w1QGXVYgPqW91UcKPEHTexRdp8p9-Eevc_OBB5IeksK3gkl7wfhYmVwj9NVJgWO5-v1vN9nA9DbJtLF23SH9SESgXNv7p9zii-Em_vq85lJCvixXHW3OCZ8f3NZ40J4rclwZdBJ9TAwk"
              bgColor="rgba(255, 237, 213, 1)" // orange-100
              darkBgColor="rgba(124, 45, 18, 0.2)" // orange-900/20
            />

            {/* Card 4: Reading */}
            <ActivityCard 
              theme={theme}
              isDark={isDark}
              title="Lectura Calma"
              subtitle="Relajación • 10 min"
              icon="menu-book"
              subIcon="local-library"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuAIf-ZqBOCl-S5N7W3t6uB_V8qO5KMgYuomJseI7lK9TvIJ3R790ReBoZQXFWqd4gALFc5j-lCAqvx031NOYiP8W4pcTYzOPVDWjOrS3rwCaxfiXNAXQywQFhRMNQjkOAhAf5PKE5GbtHsJorjUGk2C4qBFaoaOEHkzXB7jpRsolIHB6WR37Ae5x7LqQhydFPRzg4ItjPsr4oNayMBoPoWb0RFY5r3O_V-BGnzMRQ9J4Qy6u2KxU2AQA04zhwIBShh4Z7lQyzvzWPw"
              bgColor="rgba(252, 231, 243, 1)" // pink-100
              darkBgColor="rgba(131, 24, 67, 0.2)" // pink-900/20
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityCard({ theme, isDark, title, subtitle, icon, subIcon, imageUri, bgColor, darkBgColor, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.activityCard, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={onPress}>
      <View style={styles.activityContent}>
        <View style={[styles.activityImageContainer, { backgroundColor: isDark ? darkBgColor : bgColor }]}>
          <Image source={{ uri: imageUri }} style={styles.activityImage} />
          <View style={styles.activityIconOverlay}>
            <MaterialIcons name={icon as any} size={24} color="white" style={styles.dropShadow} />
          </View>
        </View>
        <View style={styles.activityTextContainer}>
          <Text style={[styles.activityTitle, { color: theme.text }]}>{title}</Text>
          <View style={styles.activitySubtitleContainer}>
            <MaterialIcons name={subIcon as any} size={16} color={theme.textSecondary} />
            <Text style={[styles.activitySubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={onPress}>
          <MaterialIcons name="play-arrow" size={24} color={Colors.backgroundDark} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 9999,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(54, 226, 123, 0.3)',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  trendContainer: {
    alignItems: 'flex-end',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(54, 226, 123, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  trendLabel: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 4,
  },
  chartContainer: {
    height: 128,
    width: '100%',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activitiesSection: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  cardsContainer: {
    gap: 16,
    paddingHorizontal: 16,
  },
  activityCard: {
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
  },
  activityImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  activityIconOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activityTextContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  activitySubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activitySubtitle: {
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
