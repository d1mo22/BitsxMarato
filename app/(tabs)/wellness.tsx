import React, { useCallback, useMemo, useState } from "react";
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
import { useFocusEffect } from "expo-router";

import { useTheme } from "@/hooks/use-theme";
import { globalStyles } from "@/styles/global";
import { useFormStore, Domain } from "@/app/stores/formStore";

/* ───────────────── TYPES ───────────────── */

type CategoryKey =
  | "general"
  | "memoria_treball"
  | "fluencia_alternant"
  | "atencio"
  | "velocitat"
  | "executives"; // ✅ opcional pero útil (tu formStore sí tiene executives)

type Video = {
  id: string;
  title: string;
  duration: string;
  url: string;
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

async function openExternalUrl(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("No se puede abrir", "No he podido abrir este enlace.");
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("Error", "Ha habido un problema abriendo el enlace.");
  }
}

function domainToCategoryKey(domain: Domain): CategoryKey {
  switch (domain) {
    case "memoria":
      return "memoria_treball";
    case "fluencia":
      return "fluencia_alternant";
    case "atencio":
      return "atencio";
    case "velocitat":
      return "velocitat";
    case "executives":
      return "executives";
  }
}

function categoryLabelForBadge(key: CategoryKey) {
  switch (key) {
    case "general":
      return "General";
    case "memoria_treball":
      return "Memoria de trabajo";
    case "fluencia_alternant":
      return "Fluencia alternante";
    case "atencio":
      return "Atención";
    case "velocitat":
      return "Velocidad";
    case "executives":
      return "Funciones ejecutivas";
  }
}

/* ───────────────── COMPONENT ───────────────── */

export default function WellnessScreen() {
  const { colors: theme, isDark } = useTheme();

  const { ready, today, refresh, getAffectedDomainsForDay } = useFormStore();

  // ✅ Refresca cuando vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      refresh?.();
    }, [refresh])
  );

  // 📌 Datos “hoy” desde formStore
  const { affectedDomains, domainCounts } = useMemo(() => {
    if (!ready || !getAffectedDomainsForDay) {
      return { affectedDomains: [] as Domain[], domainCounts: {} as Record<Domain, number> };
    }
    const r = getAffectedDomainsForDay(today);
    return { affectedDomains: r.affected as Domain[], domainCounts: r.counts as Record<Domain, number> };
  }, [ready, getAffectedDomainsForDay, today]);

  // ✅ Categories base (tu contenido)
  const CATEGORIES: Category[] = useMemo(
    () => [
      {
        key: "general",
        title: "General",
        subtitle: "Recomendaciones globales para el bienestar cognitivo",
        icon: "health-and-safety",
        videos: [
          { id: "g1", title: "La cognición y sus funciones", duration: "6:00", url: "https://youtu.be/hcBaJisV1Wo?feature=shared" },
          { id: "g2", title: "Déficits cognitivos y cáncer", duration: "4:36", url: "https://www.youtube.com/watch?v=sB6u7ZhNrHk" },
          { id: "g3", title: "Déficits cognitivos en el día a día", duration: "4:45", url: "https://www.youtube.com/watch?v=24P5B6L0IgQ" },
        ],
        tips: [
          "Mantén horarios regulares de sueño.",
          "Haz pausas breves cada 25–30 minutos.",
          "Hidrátate a menudo durante el día.",
          "Reduce la multitarea cuando estés cansado/a.",
          "Exposición a luz natural por la mañana.",
        ],
      },
      {
        key: "memoria_treball",
        title: "Memoria de trabajo",
        subtitle: "Mantener y manipular información mentalmente",
        icon: "memory",
        videos: [
          { id: "m1", title: "Aliviar problemas cognitivos: Estimulación", duration: "6:29", url: "https://www.youtube.com/watch?v=RExO6edCQYk" },
          { id: "m2", title: "Aliviar problemas cognitivos: Estrategias compensatorias", duration: "7:16", url: "https://www.youtube.com/watch?v=FJIy-R3Gze4" },
          { id: "m3", title: "La agenda", duration: "4:01", url: "https://www.youtube.com/watch?v=iGTnb1YeRNw" },
        ],
        tips: [
          "Esta semana es ideal para recuperar una receta que te salía muy bien.",
          "Prueba a aprender 5 palabras de un idioma nuevo y repítelas al final del día.",
          "Apunta 3 cosas importantes del día y revísalas antes de ir a dormir.",
        ],
      },
      {
        key: "fluencia_alternant",
        title: "Fluencia verbal alternante",
        subtitle: "Cambiar entre categorías o criterios",
        icon: "swap-horiz",
        videos: [
          { id: "f1", title: "Mindfulness", duration: "5:20", url: "https://www.youtube.com/watch?v=B_M8eFq2GCA" },
          { id: "f2", title: "Mindfulness: preparación para la práctica", duration: "7:20", url: "https://www.youtube.com/watch?v=_5HCl5CDA94" },
          { id: "f3", title: "Mindfulness: postura", duration: "2:45", url: "https://www.youtube.com/watch?v=fXDHm8PP6qo" },
          { id: "f4", title: "Cómo tratarnos ante los fallos cognitivos: Amabilidad", duration: "6:11", url: "https://www.youtube.com/watch?v=OlyIT2zIimw" },
          { id: "f5", title: "Cómo tratar a los fallos cognitivos: Aceptación", duration: "7:16", url: "https://www.youtube.com/watch?v=zXqljYzFb3w" },
        ],
        tips: [
          "Durante 2 minutos: alterna frutas y animales (manzana–perro–pera–gato…).",
          "Durante 2 minutos: alterna palabras con P y ciudades.",
          "Describe 5 objetos de tu alrededor con 3 palabras cada uno.",
        ],
      },
      {
        key: "atencio",
        title: "Atención",
        subtitle: "Mantener el foco y no perder el hilo",
        icon: "center-focus-strong",
        videos: [
          { id: "a1", title: "Mindfulness", duration: "5:20", url: "https://www.youtube.com/watch?v=B_M8eFq2GCA" },
          { id: "a2", title: "Mindfulness: preparación para la práctica", duration: "7:20", url: "https://www.youtube.com/watch?v=_5HCl5CDA94" },
          { id: "a3", title: "Mindfulness: postura", duration: "2:45", url: "https://www.youtube.com/watch?v=fXDHm8PP6qo" },
          { id: "a4", title: "Cómo tratarnos ante los fallos cognitivos: Amabilidad", duration: "6:11", url: "https://www.youtube.com/watch?v=OlyIT2zIimw" },
          { id: "a5", title: "Cómo tratar a los fallos cognitivos: Aceptación", duration: "7:16", url: "https://www.youtube.com/watch?v=zXqljYzFb3w" },
        ],
        tips: [
          "Haz una tarea 10 minutos sin interrupciones (móvil en silencio).",
          "Lee un párrafo y resúmelo en 1 frase.",
          "Cuando hables con alguien: repite mentalmente la idea principal cada 20–30s.",
        ],
      },
      {
        key: "velocitat",
        title: "Velocidad de procesamiento",
        subtitle: "Pensar y reaccionar con agilidad",
        icon: "speed",
        videos: [
          { id: "v1", title: "Aliviar problemas cognitivos: Estimulación", duration: "6:29", url: "https://www.youtube.com/watch?v=RExO6edCQYk" },
          { id: "v2", title: "Aliviar problemas cognitivos: Estrategias compensatorias", duration: "7:16", url: "https://www.youtube.com/watch?v=FJIy-R3Gze4" },
        ],
        tips: [
          "Una cosa cada vez: priorizar acelera.",
          "Toma decisiones pequeñas con límite de 10–15 segundos (ropa, bebida, etc.).",
          "Cuando vayas al súper: encuentra 3 productos lo más rápido posible (sin correr).",
        ],
      },
      {
        key: "executives",
        title: "Funciones ejecutivas",
        subtitle: "Planificación, decisiones y organización",
        icon: "account-tree",
        videos: [
          { id: "e1", title: "Planificación diaria (estrategias)", duration: "6:00", url: "https://www.youtube.com/watch?v=FJIy-R3Gze4" },
        ],
        tips: [
          "Elige 3 objetivos del día y escríbelos.",
          "Divide una tarea grande en 3 pasos pequeños.",
          "Empieza por la tarea que te desbloquea el resto.",
        ],
      },
    ],
    []
  );

  // ✅ Convertimos “áreas afectadas hoy” a categorías + orden por episodios (desc)
  const affectedCategoryCounts: Partial<Record<CategoryKey, number>> = useMemo(() => {
    const acc: Partial<Record<CategoryKey, number>> = {};
    for (const d of affectedDomains) {
      const ck = domainToCategoryKey(d);
      acc[ck] = (acc[ck] ?? 0) + (domainCounts?.[d] ?? 0);
    }
    return acc;
  }, [affectedDomains, domainCounts]);

  const affectedCategoryKeysSorted: CategoryKey[] = useMemo(() => {
    const keys = Object.keys(affectedCategoryCounts) as CategoryKey[];
    return keys.sort((a, b) => (affectedCategoryCounts[b] ?? 0) - (affectedCategoryCounts[a] ?? 0));
  }, [affectedCategoryCounts]);

  // ✅ Orden final: General siempre, luego afectadas, luego el resto
  const orderedCategories: Category[] = useMemo(() => {
    const byKey = new Map(CATEGORIES.map((c) => [c.key, c] as const));

    const result: Category[] = [];
    // 1) general
    const general = byKey.get("general");
    if (general) result.push(general);

    // 2) afectadas (sin repetir)
    for (const k of affectedCategoryKeysSorted) {
      if (k === "general") continue;
      const c = byKey.get(k);
      if (c && !result.some((x) => x.key === c.key)) result.push(c);
    }

    // 3) resto
    for (const c of CATEGORIES) {
      if (!result.some((x) => x.key === c.key)) result.push(c);
    }

    return result;
  }, [CATEGORIES, affectedCategoryKeysSorted]);

  // ✅ Expansión: general abierto + afectadas abiertas
  const [expanded, setExpanded] = useState<Record<CategoryKey, boolean>>({
    general: true,
    memoria_treball: false,
    fluencia_alternant: false,
    atencio: false,
    velocitat: false,
    executives: false,
  });

  // Cuando cambian afectadas, auto-abrimos esas categorías (sin cerrar lo que el usuario ya abrió)
  React.useEffect(() => {
    if (!ready) return;
    setExpanded((prev) => {
      const next = { ...prev, general: true };
      for (const k of affectedCategoryKeysSorted) next[k] = true;
      return next;
    });
  }, [ready, affectedCategoryKeysSorted]);

  const toggle = (key: CategoryKey) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[globalStyles.header, { paddingHorizontal: 16 }]}>
        <Text style={[globalStyles.title, { color: theme.text }]}>Bienestar</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* ✅ Mini resumen arriba */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>
            Recomendaciones de hoy ({today})
          </Text>
          {!ready ? (
            <Text style={{ color: theme.textSecondary, marginTop: 6, fontWeight: "700" }}>Cargando…</Text>
          ) : affectedCategoryKeysSorted.length === 0 ? (
            <Text style={{ color: theme.textSecondary, marginTop: 6, fontWeight: "700" }}>
              No has marcado ningún episodio hoy. “General” siempre está disponible.
            </Text>
          ) : (
            <View style={{ marginTop: 8, gap: 6 }}>
              {affectedCategoryKeysSorted.map((k) => (
                <Text key={k} style={{ color: theme.textSecondary, fontWeight: "700" }}>
                  • {categoryLabelForBadge(k)}: {affectedCategoryCounts[k] ?? 0}
                </Text>
              ))}
            </View>
          )}
        </View>

        {orderedCategories.map((cat) => {
          const isRecommended = cat.key !== "general" && (affectedCategoryCounts[cat.key] ?? 0) > 0;
          const recCount = affectedCategoryCounts[cat.key] ?? 0;

          return (
            <View
              key={cat.key}
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              {/* Header category */}
              <TouchableOpacity onPress={() => toggle(cat.key)} style={styles.catHeader} activeOpacity={0.85}>
                <View style={styles.catLeft}>
                  <MaterialIcons name={cat.icon} size={26} color={theme.primary} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Text style={[styles.catTitle, { color: theme.text }]}>{cat.title}</Text>

                      {/* ✅ Badge "Recomendado hoy" */}
                      {isRecommended && (
                        <View
                          style={[
                            styles.badge,
                            {
                              backgroundColor: isDark ? "rgba(54,226,123,0.12)" : "rgba(54,226,123,0.14)",
                              borderColor: isDark ? "rgba(54,226,123,0.35)" : "rgba(54,226,123,0.35)",
                            },
                          ]}
                        >
                          <Text style={{ color: theme.text, fontWeight: "900", fontSize: 12 }}>
                            Recomendado hoy · {recCount}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.catSubtitle, { color: theme.textSecondary }]}>{cat.subtitle}</Text>
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
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Vídeos</Text>

                    {cat.videos.map((v) => (
                      <TouchableOpacity
                        key={v.id}
                        activeOpacity={0.85}
                        onPress={() => openExternalUrl(v.url)}
                        style={[styles.videoRow, { borderColor: theme.border }]}
                      >
                        <MaterialIcons name="play-circle-outline" size={28} color={theme.primary} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.videoTitle, { color: theme.text }]}>{v.title}</Text>
                          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                            {v.duration} · Toca para abrir en YouTube
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
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Recomendaciones</Text>

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
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────── STYLES ───────────────── */

const styles = StyleSheet.create({
  infoBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
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
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
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
