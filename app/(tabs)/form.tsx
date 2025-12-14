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
      return "Atención";
    case "velocitat":
      return "Velocidad de procesamiento";
    case "fluencia":
      return "Fluidez verbal";
    case "memoria":
      return "Memoria";
    case "executives":
      return "Funciones ejecutivas";
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
              Hoy: {count}
            </Text>
          </View>
        </View>

        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
          Toca cada vez que te pase (suma +1)
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
      { key: "room_forget", text: "He ido a un lugar de la habitación y, al llegar, no recordaba qué iba a hacer.", domain: "atencio" },
      { key: "slow_activity", text: "He tardado más de lo normal en hacer una actividad que antes hacía más rápido.", domain: "velocitat" },
      { key: "word_block", text: "Quería decir una palabra y no me ha salido, o he dicho otra sin querer.", domain: "fluencia" },
      { key: "lose_thread", text: "Cuando estaba hablando con alguien, he perdido el hilo de la conversación.", domain: "atencio" },
      { key: "recent_forget", text: "Me han preguntado por algo que me habían dicho hace poco y no lo he recordado.", domain: "memoria" },
      { key: "longterm_forget", text: "He tenido problemas para recordar información que ya sabía previamente.", domain: "memoria" },
      { key: "decision_hard", text: "He tenido problemas para tomar una decisión que antes no me habría costado.", domain: "executives" },
      { key: "plan_day", text: "He tenido dificultades para planificar mi día.", domain: "executives" },
      { key: "brain_fog", text: "He sentido sensación de neblina mental.", domain: "executives" },
      { key: "think_slower", text: "He sentido que pienso más lento hoy.", domain: "velocitat" },
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
      if (c > 0) counts[it.domain] += c;
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
          <Text style={{ color: theme.text }}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[globalStyles.header, { paddingHorizontal: 16 }]}>
        <Text style={[globalStyles.title, { color: theme.text }]}>Registro</Text>
        <TouchableOpacity onPress={reset} style={{ padding: 8 }}>
          <MaterialIcons name="restart-alt" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Día */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Hoy ({today})</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Toca una afirmación cada vez que te haya pasado. Se guarda automáticamente.
          </Text>
        </View>

        {/* Mood */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>¿Cómo te sientes?</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}></Text>

          <View style={styles.rowWrap}>
            <Pill label="🙂 Bien" active={state.mood === "bien"} onPress={() => setMood("bien")} theme={theme} />
            <Pill label="😐 Regular" active={state.mood === "regular"} onPress={() => setMood("regular")} theme={theme} />
            <Pill label="🙁 Mal" active={state.mood === "mal"} onPress={() => setMood("mal")} theme={theme} />
            <Pill label="Quitar" active={state.mood === null} onPress={() => setMood(null)} theme={theme} />
          </View>
        </View>

        {/* Preguntas */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Hoy me ha pasado…</Text>

          <View style={{ gap: 12, marginTop: 12 }}>
            {ITEMS.map((it) => {
              const count = getTodayCount(it.key);
              return (
                <ItemRow
                  key={it.key}
                  count={count}
                  onPress={() => incrementItem(it.key)}
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
          <Text style={[styles.cardTitle, { color: theme.text }]}>Resumen de áreas (hoy)</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Total de episodios hoy por área:
          </Text>

          {summary.affected.length === 0 ? (
            <Text style={{ color: theme.textSecondary, fontWeight: "700" }}>
              Todavía no has marcado ningún episodio.
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
            Última actualización: {state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "—"}
          </Text>
        </View>

        {/* Notes */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text, paddingBottom: 12 }]}>Notas</Text>

          <TextInput
            value={state.notes}
            onChangeText={setNotes}
            placeholder="Escribe algo…"
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
