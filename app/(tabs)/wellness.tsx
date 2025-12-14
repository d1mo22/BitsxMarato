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
      Alert.alert("No es pot obrir", "No he pogut obrir aquest enllaç.");
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("Error", "Hi ha hagut un problema obrint l’enllaç.");
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
      return "Memòria de treball";
    case "fluencia_alternant":
      return "Fluència alternant";
    case "atencio":
      return "Atenció";
    case "velocitat":
      return "Velocitat";
    case "executives":
      return "Funcions executives";
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
        subtitle: "Recomanacions globals per al benestar cognitiu",
        icon: "health-and-safety",
        videos: [
          { id: "g1", title: "La cognición y sus funciones", duration: "6:00", url: "https://youtu.be/hcBaJisV1Wo?feature=shared" },
          { id: "g2", title: "Déficits cognitivos y cáncer", duration: "4:36", url: "https://www.youtube.com/watch?v=sB6u7ZhNrHk" },
          { id: "g3", title: "Déficits cognitivos en el día a día", duration: "4:45", url: "https://www.youtube.com/watch?v=24P5B6L0IgQ" },
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
          { id: "m1", title: "Aliviar problemas cognitivos: Estimulación", duration: "6:29", url: "https://www.youtube.com/watch?v=RExO6edCQYk" },
          { id: "m2", title: "Aliviar problemas cognitivos: Estrategias compensatorias", duration: "7:16", url: "https://www.youtube.com/watch?v=FJIy-R3Gze4" },
          { id: "m3", title: "La agenda", duration: "4:01", url: "https://www.youtube.com/watch?v=iGTnb1YeRNw" },
        ],
        tips: [
          "Aquesta setmana és ideal per recuperar una recepta que et sortia molt bé.",
          "Prova d’aprendre 5 paraules d’un idioma nou i repeteix-les al final del dia.",
          "Apunta 3 coses importants del dia i revisa-les abans d’anar a dormir.",
        ],
      },
      {
        key: "fluencia_alternant",
        title: "Fluència verbal alternant",
        subtitle: "Canviar entre categories o criteris",
        icon: "swap-horiz",
        videos: [
          { id: "f1", title: "Mindfulness", duration: "5:20", url: "https://www.youtube.com/watch?v=B_M8eFq2GCA" },
          { id: "f2", title: "Mindfulness: preparación para la práctica", duration: "7:20", url: "https://www.youtube.com/watch?v=_5HCl5CDA94" },
          { id: "f3", title: "Mindfulness: postura", duration: "2:45", url: "https://www.youtube.com/watch?v=fXDHm8PP6qo" },
          { id: "f4", title: "Cómo tratarnos ante los fallos cognitivos: Amabilidad", duration: "6:11", url: "https://www.youtube.com/watch?v=OlyIT2zIimw" },
          { id: "f5", title: "Cómo tratar a los fallos cognitivos: Aceptación", duration: "7:16", url: "https://www.youtube.com/watch?v=zXqljYzFb3w" },
        ],
        tips: [
          "Durant 2 minuts: alterna fruites i animals (poma–gos–pera–gat…).",
          "Durant 2 minuts: alterna paraules amb P i ciutats.",
          "Descriu 5 objectes del teu voltant amb 3 paraules cadascun.",
        ],
      },
      {
        key: "atencio",
        title: "Atenció",
        subtitle: "Mantenir el focus i no perdre el fil",
        icon: "center-focus-strong",
        videos: [
          { id: "a1", title: "Mindfulness", duration: "5:20", url: "https://www.youtube.com/watch?v=B_M8eFq2GCA" },
          { id: "a2", title: "Mindfulness: preparación para la práctica", duration: "7:20", url: "https://www.youtube.com/watch?v=_5HCl5CDA94" },
          { id: "a3", title: "Mindfulness: postura", duration: "2:45", url: "https://www.youtube.com/watch?v=fXDHm8PP6qo" },
          { id: "a4", title: "Cómo tratarnos ante los fallos cognitivos: Amabilidad", duration: "6:11", url: "https://www.youtube.com/watch?v=OlyIT2zIimw" },
          { id: "a5", title: "Cómo tratar a los fallos cognitivos: Aceptación", duration: "7:16", url: "https://www.youtube.com/watch?v=zXqljYzFb3w" },
        ],
        tips: [
          "Fes una tasca 10 minuts sense interrupcions (mòbil en silenci).",
          "Llegeix un paràgraf i resumeix-lo en 1 frase.",
          "Quan parlis amb algú: repeteix mentalment la idea principal cada 20–30s.",
        ],
      },
      {
        key: "velocitat",
        title: "Velocitat de processament",
        subtitle: "Pensar i reaccionar amb agilitat",
        icon: "speed",
        videos: [
          { id: "v1", title: "Aliviar problemas cognitivos: Estimulación", duration: "6:29", url: "https://www.youtube.com/watch?v=RExO6edCQYk" },
          { id: "v2", title: "Aliviar problemas cognitivos: Estrategias compensatorias", duration: "7:16", url: "https://www.youtube.com/watch?v=FJIy-R3Gze4" },
        ],
        tips: [
          "Una cosa cada cop: prioritzar accelera.",
          "Fes decisions petites amb límit de 10–15 segons (roba, beguda, etc.).",
          "Quan vagis al súper: troba 3 productes el més ràpid possible (sense córrer).",
        ],
      },
      {
        key: "executives",
        title: "Funcions executives",
        subtitle: "Planificació, decisions i organització",
        icon: "account-tree",
        videos: [
          { id: "e1", title: "Planificación diaria (estrategias)", duration: "6:00", url: "https://www.youtube.com/watch?v=FJIy-R3Gze4" },
        ],
        tips: [
          "Tria 3 objectius del dia i escriu-los.",
          "Divideix una tasca gran en 3 passos petits.",
          "Comença per la tasca que et desbloqueja la resta.",
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
        <Text style={[globalStyles.title, { color: theme.text }]}>Benestar</Text>
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
            Recomanacions d’avui ({today})
          </Text>
          {!ready ? (
            <Text style={{ color: theme.textSecondary, marginTop: 6, fontWeight: "700" }}>Carregant…</Text>
          ) : affectedCategoryKeysSorted.length === 0 ? (
            <Text style={{ color: theme.textSecondary, marginTop: 6, fontWeight: "700" }}>
              No has marcat cap episodi avui. “General” sempre està disponible.
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
                            Recomanat avui · {recCount}
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
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Recomanacions</Text>

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
