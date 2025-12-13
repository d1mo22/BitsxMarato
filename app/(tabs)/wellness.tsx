import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";
import { globalStyles } from "@/styles/global";

/* ───────────────── TYPES ───────────────── */

type CategoryKey =
  | "general"
  | "memoria_treball"
  | "fluencia_alternant"
  | "atencio"
  | "velocitat";

type Video = {
  id: string;
  title: string;
  duration: string;
  url: string; // ✅ URL real (youtube)
};

type Category = {
  key: CategoryKey;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  videos: Video[];
  tips: string[];
};

/* ───────────────── HELPERS ───────────────── */

// Opcional: si tens videoId, pots construir URLs
function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// Intenta obrir. Si no pot, avisa.
async function openExternalUrl(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("No es pot obrir", "No he pogut obrir aquest enllaç.");
      return;
    }
    await Linking.openURL(url);
  } catch (e) {
    Alert.alert("Error", "Hi ha hagut un problema obrint l’enllaç.");
  }
}

/* ───────────────── COMPONENT ───────────────── */

export default function WellnessScreen() {
  const { colors: theme, isDark } = useTheme();
  const [expanded, setExpanded] = useState<Record<CategoryKey, boolean>>({
    general: true,
    memoria_treball: false,
    fluencia_alternant: false,
    atencio: false,
    velocitat: false,
  });

  const toggle = (key: CategoryKey) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));

  /* ───────────────── DATA ───────────────── */
  // ⚠️ Posa aquí els teus links reals de YouTube.
  // Pots posar URL directes (recommended) o generar-les amb youtubeWatchUrl("VIDEO_ID").

  const CATEGORIES: Category[] = useMemo(
    () => [
      {
        key: "general",
        title: "General",
        subtitle: "Recomanacions globals per al benestar cognitiu",
        icon: "health-and-safety",
        videos: [
          {
            id: "g1",
            title: " La cognición y sus funciones",
            duration: "6:00",
            url: "https://youtu.be/hcBaJisV1Wo?feature=shared",
          },
          {
            id: "g2",
            title: "Déficits cognitivos y cáncer",
            duration: "4:36",
            url: "https://www.youtube.com/watch?v=sB6u7ZhNrHk",
          },
          {
            id: "g3",
            title: "Déficits cognitivos en el día a día",
            duration: "4:45",
            url: "https://www.youtube.com/watch?v=24P5B6L0IgQ",
          },
        ],
        tips: [
          "Mantén horaris regulars de son.",
          "Fes pauses breus cada 25–30 minuts.",
          "Hidrata’t sovint durant el dia.",
          "Redueix la multitarea quan estàs cansat/da.",
          "Exposició a llum natural al matí.",
        ],
      },
      {
        key: "memoria_treball",
        title: "Memòria de treball",
        subtitle: "Mantenir i manipular informació mentalment",
        icon: "memory",
        videos: [
          {
            id: "m1",
            title: "Aliviar problemas cognitivos: Estimulación",
            duration: "6:29",
            url: "https://www.youtube.com/watch?v=RExO6edCQYk",
          },
          {
            id: "m2",
            title: "Aliviar problemas cognitivos: Estrategias compensatorias",
            duration: "7:16",
            url: "https://www.youtube.com/watch?v=FJIy-R3Gze4",
          },
          {
            id: "m3",
            title: "La agenda",
            duration: "4:01",
            url: "https://www.youtube.com/watch?v=iGTnb1YeRNw",
          },
        ],
        tips: [
          "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
          "Aquesta setmana és ideal per fer tornar a fer aquella recepta que has deixat de fer i et sortia tan bé...",
          "Prova d'aprendre algunes paraules d'un nou idioma, potser un idioma que ja en sàpigues una mica o un completament nou!"
        ],
      },
      {
        key: "fluencia_alternant",
        title: "Fluència verbal alternant",
        subtitle: "Canviar entre categories o criteris",
        icon: "swap-horiz",
        videos: [
          {
            id: "f1",
            title: "Mindfulness",
            duration: "5:20",
            url: "https://www.youtube.com/watch?v=B_M8eFq2GCA",
          },
          {
            id: "f2",
            title: "Mindfulness: preparación para la práctica",
            duration: "7:20",
            url: "https://www.youtube.com/watch?v=_5HCl5CDA94",
          },
          {
            id: "f3",
            title: "Mindfulness: postura",
            duration: "2:45",
            url: "https://www.youtube.com/watch?v=fXDHm8PP6qo",
          },
          {
            id: "f4",
            title: "Cómo tratarnos ante los fallos cognitivos: Amabilidad",
            duration: "6:11",
            url: "https://www.youtube.com/watch?v=OlyIT2zIimw",
          },
          {
            id: "f5",
            title: "Cómo tratar a los fallos cognitivos: Aceptación",
            duration: "7:16",
            url: "https://www.youtube.com/watch?v=zXqljYzFb3w",
          },
        ],
        tips: [
          "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
          "Avui durant 5 minuts has d'anar dient els objectes que veus al teu voltant",
          "Pensa durant uns minuts quantes fruites I verdures hi ha de color vermell",
        ],
      },
      {
        key: "atencio",
        title: "Atenció",
        subtitle: "Mantenir el focus i no perdre el fil",
        icon: "center-focus-strong",
        videos: [
          {
            id: "a1",
            title: "Mindfulness",
            duration: "5:20",
            url: "https://www.youtube.com/watch?v=B_M8eFq2GCA",
          },
          {
            id: "a2",
            title: "Mindfulness: preparación para la práctica",
            duration: "7:20",
            url: "https://www.youtube.com/watch?v=_5HCl5CDA94",
          },
          {
            id: "a3",
            title: "Mindfulness: postura",
            duration: "2:45",
            url: "https://www.youtube.com/watch?v=fXDHm8PP6qo",
          },
          {
            id: "a4",
            title: "Cómo tratarnos ante los fallos cognitivos: Amabilidad",
            duration: "6:11",
            url: "https://www.youtube.com/watch?v=OlyIT2zIimw",
          },
          {
            id: "a5",
            title: "Cómo tratar a los fallos cognitivos: Aceptación",
            duration: "7:16",
            url: "https://www.youtube.com/watch?v=zXqljYzFb3w",
          },
        ],
        tips: [
          "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
          "Aquesta setmana és ideal per fer alguna manualitat, posa molta atenció en allò que fas, potser un dibuix, un puzle, cosir alguna cosa, etc.",
          "Si tens una estona, llegeix un text curt (una notícia, un paràgraf d’un llibre) i intenta comprendre’l detenidament. Pots subratllar mentalment les idees importants per mantenir-te concentrat.",
        ],
      },
      {
        key: "velocitat",
        title: "Velocitat de processament",
        subtitle: "Pensar i reaccionar amb agilitat",
        icon: "speed",
        videos: [
          {
            id: "v1",
            title: "Aliviar problemas cognitivos: Estimulación",
            duration: "6:29",
            url: "https://www.youtube.com/watch?v=RExO6edCQYk",
          },
          {
            id: "v2",
            title: "Aliviar problemas cognitivos: Estrategias compensatorias",
            duration: "7:16",
            url: "https://www.youtube.com/watch?v=FJIy-R3Gze4",
          },
        ],
        tips: [
          "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
          "Avui és el dia de les decisions ràpides no pots tardar més de 15 segons en escollir la roba que et posaràs",
          "Dia d'anar al supermercat! Prova a trobar lo més ràpid possible on son les galetes Maria al teu supermercat de confiança",
        ],
      },
    ],
    []
  );

  return (
    <SafeAreaView
      style={[globalStyles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[globalStyles.header, { paddingHorizontal: 16 }]}>
        <Text style={[globalStyles.title, { color: theme.text }]}>
          Benestar
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {CATEGORIES.map((cat) => (
          <View
            key={cat.key}
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            {/* Header category */}
            <TouchableOpacity
              onPress={() => toggle(cat.key)}
              style={styles.catHeader}
              activeOpacity={0.85}
            >
              <View style={styles.catLeft}>
                <MaterialIcons name={cat.icon} size={26} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.catTitle, { color: theme.text }]}>
                    {cat.title}
                  </Text>
                  <Text
                    style={[styles.catSubtitle, { color: theme.textSecondary }]}
                  >
                    {cat.subtitle}
                  </Text>
                </View>
              </View>

              <MaterialIcons
                name={expanded[cat.key] ? "expand-less" : "expand-more"}
                size={28}
                color={theme.textSecondary}
              />
            </TouchableOpacity>

            {/* Content */}
            {expanded[cat.key] && (
              <View style={{ gap: 16, marginTop: 12 }}>
                {/* Videos */}
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Vídeos
                  </Text>

                  {cat.videos.map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      activeOpacity={0.85}
                      onPress={() => openExternalUrl(v.url)}
                      style={[styles.videoRow, { borderColor: theme.border }]}
                    >
                      <MaterialIcons
                        name="play-circle-outline"
                        size={28}
                        color={theme.primary}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.videoTitle, { color: theme.text }]}>
                          {v.title}
                        </Text>
                        <Text
                          style={{
                            color: theme.textSecondary,
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {v.duration} · Toca per obrir a YouTube
                        </Text>
                      </View>
                      <MaterialIcons
                        name={Platform.OS === "ios" ? "arrow-forward-ios" : "open-in-new"}
                        size={18}
                        color={theme.textSecondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tips */}
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Recomanacions
                  </Text>

                  {cat.tips.map((t, i) => (
                    <View key={i} style={styles.tipRow}>
                      <MaterialIcons name="check" size={20} color={theme.primary} />
                      <Text style={[styles.tipText, { color: theme.text }]}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────── STYLES ───────────────── */

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },
  catTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  catSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  videoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  tipRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    flex: 1,
  },
});
