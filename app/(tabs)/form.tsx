import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { globalStyles } from "@/styles/global";
import { useFormStore, Domain } from "@/app/stores/formStore";

type ItemDef = {
  key: string;
  text: string;
  domain: Domain;
};

function domainLabel(d: Domain) {
  switch (d) {
    case "atencio":
      return "Atenció";
    case "velocitat":
      return "Velocitat de processament";
    case "fluencia":
      return "Fluència verbal";
    case "memoria":
      return "Memòria";
    case "executives":
      return "Funcions executives";
  }
}

function Pill({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.pill,
        {
          borderColor: active ? theme.primary : theme.border,
          backgroundColor: active ? theme.primary : theme.pillBg,
        },
      ]}
    >
      <MaterialIcons
        name={active ? "check-circle" : "radio-button-unchecked"}
        size={18}
        color={active ? "#ffffff" : theme.textSecondary}
      />
      <Text style={[styles.pillText, { color: active ? "#ffffff" : theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ItemRow({
  count,
  onPress,
  text,
  domain,
  theme,
}: {
  count: number;
  onPress: () => void;
  text: string;
  domain: string;
  theme: any;
}) {
  const active = count > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.itemRow,
        {
          borderColor: active ? theme.primary : theme.border,
          backgroundColor: active ? theme.selectedBg : theme.surface,
        },
      ]}
    >
      {/* Indicador visual */}
      <View
        style={[
          styles.dot,
          {
            backgroundColor: active ? theme.primary : theme.border,
            opacity: active ? 1 : 0.6,
          },
        ]}
      />

      <View style={{ flex: 1, gap: 8 }}>
        <Text style={[styles.itemText, { color: theme.text }]}>{text}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.border }]}>
            <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{domain}</Text>
          </View>

          {/* ✅ Indicador principal */}
          <View
            style={[
              styles.countPill,
              {
                backgroundColor: active ? theme.primary : theme.badgeBg,
                borderColor: active ? theme.primary : theme.border,
              },
            ]}
          >
            <Text style={[styles.countText, { color: active ? "#fff" : theme.text }]}>
              Avui: {count}
            </Text>
          </View>
        </View>

        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
          Toca cada vegada que et passi (suma +1)
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function FormTabScreen() {
  const isDark = useColorScheme() === "dark";

  const theme = useMemo(
    () => ({
      background: isDark ? Colors.backgroundDark : Colors.backgroundLight,
      text: isDark ? Colors.white : Colors.gray900,
      textSecondary: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.62)",
      surface: isDark ? Colors.surfaceDark : Colors.surfaceLight,
      border: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)",
      primary: "#1F7A5C",
      pillBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      selectedBg: isDark ? "rgba(31,122,92,0.18)" : "rgba(31,122,92,0.10)",
      badgeBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    }),
    [isDark]
  );

  const { state, ready, today, setMood, incrementItem, setNotes, reset, getTodayCount } = useFormStore();

  const ITEMS: ItemDef[] = useMemo(
    () => [
      { key: "room_forget", text: "He anat a un lloc de l’habitació i, quan hi he arribat, no he recordat què hi anava a fer.", domain: "atencio" },
      { key: "slow_activity", text: "He trigat més del normal a fer una activitat que abans feia més ràpid.", domain: "velocitat" },
      { key: "word_block", text: "Volia dir una paraula i no m’ha sortit, o n’he dit una altra sense voler.", domain: "fluencia" },
      { key: "lose_thread", text: "Quan estava parlant amb algú, he perdut el fil de la conversa.", domain: "atencio" },
      { key: "recent_forget", text: "M’han preguntat per una cosa que m’havien dit fa poc i no me n’he recordat.", domain: "memoria" },
      { key: "longterm_forget", text: "He tingut problemes per recordar informació que ja sabia prèviament.", domain: "memoria" },
      { key: "decision_hard", text: "He tingut problemes per prendre una decisió que abans no m’hauria costat.", domain: "executives" },
      { key: "plan_day", text: "He tingut dificultats per planificar el meu dia.", domain: "executives" },
      { key: "brain_fog", text: "He sentit sensació de nebulosa mental.", domain: "executives" },
      { key: "think_slower", text: "He sentit que penso més lenta avui.", domain: "velocitat" },
    ],
    []
  );

  const summary = useMemo(() => {
    const counts: Record<Domain, number> = {
      atencio: 0,
      velocitat: 0,
      fluencia: 0,
      memoria: 0,
      executives: 0,
    };

    for (const it of ITEMS) {
      const c = getTodayCount(it.key);
      if (c > 0) counts[it.domain] += c; // suma episodios de hoy
    }

    const affected = (Object.keys(counts) as Domain[])
      .filter((d) => counts[d] > 0)
      .sort((a, b) => counts[b] - counts[a]);

    return { counts, affected };
  }, [ITEMS, getTodayCount]);

  if (!ready) {
    return (
      <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
        <View style={{ padding: 24 }}>
          <Text style={{ color: theme.text }}>Carregant…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[globalStyles.header, { paddingHorizontal: 16 }]}>
        <Text style={[globalStyles.title, { color: theme.text }]}>Registre</Text>
        <TouchableOpacity onPress={reset} style={{ padding: 8 }}>
          <MaterialIcons name="restart-alt" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Día */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Avui ({today})</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Toca una afirmació cada vegada que t’hagi passat. Es guarda automàticament.
          </Text>
        </View>

        {/* Mood */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Com et sents?</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>Opcional.</Text>

          <View style={styles.rowWrap}>
            <Pill label="🙂 Bé" active={state.mood === "bien"} onPress={() => setMood("bien")} theme={theme} />
            <Pill label="😐 Regular" active={state.mood === "regular"} onPress={() => setMood("regular")} theme={theme} />
            <Pill label="🙁 Mal" active={state.mood === "mal"} onPress={() => setMood("mal")} theme={theme} />
            <Pill label="Treure" active={state.mood === null} onPress={() => setMood(null)} theme={theme} />
          </View>
        </View>

        {/* Preguntas */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Avui m’ha passat…</Text>

          <View style={{ gap: 12, marginTop: 12 }}>
            {ITEMS.map((it) => {
              const count = getTodayCount(it.key);
              return (
                <ItemRow
                  key={it.key}
                  count={count}
                  onPress={() => incrementItem(it.key)} // ✅ sumar siempre
                  text={it.text}
                  domain={domainLabel(it.domain)}
                  theme={theme}
                />
              );
            })}
          </View>
        </View>

        {/* Resumen */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Resum d’àrees (avui)</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Total d’episodis avui per àrea:
          </Text>

          {summary.affected.length === 0 ? (
            <Text style={{ color: theme.textSecondary, fontWeight: "700" }}>
              Encara no has marcat cap episodi.
            </Text>
          ) : (
            <View style={{ gap: 10 }}>
              {summary.affected.map((d) => (
                <View key={d} style={styles.summaryRow}>
                  <Text style={[styles.summaryName, { color: theme.text }]}>{domainLabel(d)}</Text>
                  <View style={[styles.counter, { backgroundColor: theme.badgeBg, borderColor: theme.border }]}>
                    <Text style={{ color: theme.text, fontWeight: "900" }}>{summary.counts[d]}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 12 }}>
            Última actualització: {state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "—"}
          </Text>
        </View>

        {/* Notes */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Notes</Text>

          <TextInput
            value={state.notes}
            onChangeText={setNotes}
            placeholder="Escriu alguna cosa…"
            placeholderTextColor={isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"}
            multiline
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.pillBg },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 18, fontWeight: "800" },
  cardSubtitle: { marginTop: 6, fontSize: 13, lineHeight: 18 },

  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontSize: 14, fontWeight: "800" },

  itemRow: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  dot: { width: 10, height: 10, borderRadius: 999, marginTop: 6 },
  itemText: { fontSize: 15, lineHeight: 21, fontWeight: "700" },

  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: "800" },

  countPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  countText: { fontSize: 12, fontWeight: "900" },

  input: { borderWidth: 1, borderRadius: 14, minHeight: 110, padding: 12, fontSize: 15, fontWeight: "600", textAlignVertical: "top" },

  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  summaryName: { fontSize: 15, fontWeight: "800" },
  counter: { minWidth: 44, height: 34, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
});
