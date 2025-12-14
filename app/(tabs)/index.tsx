import { Colors } from "@/constants/colors";
import { useTheme } from "@/hooks/use-theme";
import { globalStyles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFormStore, Domain } from "@/app/stores/formStore";

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

function recommendationsFor(domain: Domain) {
  switch (domain) {
    case "atencio":
      return [
        "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
        "Aquesta setmana és ideal per fer alguna manualitat, posa molta atenció en allò que fas, potser un dibuix, un puzle, cosir alguna cosa, etc.",
        "Si tens una estona, llegeix un text curt (una notícia, un paràgraf d’un llibre) i intenta comprendre’l detenidament. Pots subratllar mentalment les idees importants per mantenir-te concentrat.",
      ];
    case "velocitat":
      return [
        "Redueix multitarea: 1 cosa cada cop.",
        "Comença per una tasca fàcil per agafar ritme.",
      ];
    case "fluencia":
      return [
        "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
        "Avui durant 5 minuts has d'anar dient els objectes que veus al teu voltant",
        "Pensa durant uns minuts quantes fruites i verdures hi ha de color vermell",
      ];
    case "memoria":
      return [
        "Avui és un bon dia per fer algo d'esport, potser anar a caminar una estona o alguna altra activitat que et vingui de gust",
        "Aquesta setmana és ideal per fer tornar a fer aquella recepta que has deixat de fer i et sortia tan bé...",
        "Prova d'aprendre algunes paraules d'un nou idioma, potser un idioma que ja en sàpigues una mica o un completament nou!",
      ];
    case "executives":
      return [
        "Trata de ponerte como objetivo hacer 3 cosas hoy",
        "Has de pensar com planificar-te, què decidiràs fer primer",
        "Comença per el que puguis fer més ràpid o el que et desbloquegi la resta.",
      ];
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors: theme, isDark } = useTheme();
  const [chartWidth, setChartWidth] = useState(0);

  const { ready, today, refresh, getAffectedDomainsForDay } = useFormStore();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const { affected, counts } = useMemo(() => {
    if (!ready) return { affected: [] as Domain[], counts: null as any };
    return getAffectedDomainsForDay(today);
  }, [ready, getAffectedDomainsForDay, today]);

  const onLayoutChart = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width !== chartWidth) requestAnimationFrame(() => setChartWidth(width));
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={[
          globalStyles.header,
          { backgroundColor: isDark ? "rgba(17, 33, 23, 0.9)" : "rgba(246, 248, 247, 0.9)" },
        ]}
      >
        <View style={globalStyles.headerLeft}>
          <TouchableOpacity style={[globalStyles.iconButton, { backgroundColor: "transparent" }]}>
            <MaterialIcons name="menu" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <View style={globalStyles.headerRight}>
          <TouchableOpacity style={[globalStyles.iconButton, { backgroundColor: "transparent" }]}>
            <MaterialIcons name="notifications" size={24} color={theme.icon} />
            <View style={globalStyles.badge} />
          </TouchableOpacity>

          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU5aans5kKgEKtbI2iEB3q5A59JcIfkXcQhojsIGbA_rAyGHac-260pA0mebPIcj0qEMLgbmTpAN_Cd04iMVBCrimt9BBX1qfeCMdp0hdmwWwe3y8FhcyItMrm_VGJaDs7Jfg7gXTKWARZ7ydeL3pxXJIZCxlhnAVZ_btJg-e0qbPfZ3_lOdm6giOJb_3KCvH4DaVFVXLftVAmzh9Om8i9WsSq-2QuGItM1LoXnPpZ_nNH6EGReUMsEBDULwjtsMcwRp71zpl7rvk",
            }}
            style={globalStyles.avatar}
          />
        </View>
      </View>

      {/* BLOQUE PRINCIPAL EN VERTICAL */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 5 }}>
        <ScrollView
          style={globalStyles.scrollView}
          contentContainerStyle={globalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[globalStyles.titleContainer, { marginTop: 16 }]}>
            <Text style={[globalStyles.title, { color: theme.text }]}>Hola, Ana.</Text>
            <Text style={[globalStyles.subtitle, { color: theme.textSecondary }]}>
              ¿Cómo te sientes hoy?
            </Text>
          </View>

          {/* (si luego quieres meter cards, gráficas, etc.) */}
          <View onLayout={onLayoutChart} />

          {/* Formulario */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/form")}
            style={{
              backgroundColor: Colors.secondary,
              borderRadius: 18,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="assignment" size={24} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Formulario</Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: "700", marginTop: 2 }}>
                Què t’ha passat ara?
              </Text>
            </View>

            <MaterialIcons name="chevron-right" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Juegos */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/games")}
            style={{
              backgroundColor: Colors.secondary,
              borderRadius: 18,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 10,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="sports-esports" size={24} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Juegos</Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: "700", marginTop: 2 }}>
                Recorda fer els tests
              </Text>
            </View>

            <MaterialIcons name="chevron-right" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Recomendaciones (NO botón) */}
          <View
            style={{
              borderRadius: 18,
              padding: 16,
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              borderWidth: 1,
              borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
              gap: 10,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: isDark ? "rgba(54,226,123,0.14)" : "rgba(54,226,123,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="tips-and-updates" size={24} color={Colors.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: "900", fontSize: 16 }}>Recomendaciones</Text>
                <Text style={{ color: theme.textSecondary, fontWeight: "700", marginTop: 2 }}>
                  Basades en el que has marcat avui ({today})
                </Text>
              </View>
            </View>

            {!ready ? (
              <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "600" }}>
                Carregant…
              </Text>
            ) : affected.length === 0 ? (
              <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "600" }}>
                Encara no has marcat cap episodi avui. Ves al formulari i toca el que t’hagi passat.
              </Text>
            ) : (
              <View style={{ gap: 14 }}>
                {/* ✅ MOSTRAR TODAS LAS ÁREAS AFECTADAS */}
                {affected.map((d) => (
                  <View key={d} style={{ gap: 8 }}>
                    <Text style={{ color: theme.text, fontWeight: "900" }}>
                      {domainLabel(d)}{" "}
                      <Text style={{ color: theme.textSecondary, fontWeight: "800" }}>
                        ({counts?.[d] ?? 0})
                      </Text>
                    </Text>

                    <View style={{ gap: 6 }}>
                      {recommendationsFor(d).map((r, i) => (
                        <Text
                          key={`${d}-${i}`}
                          style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "600" }}
                        >
                          • {r}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}

                {/* Resumen final */}
                <View style={{ marginTop: 2, gap: 6 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "800" }}>
                    Resum d’avui:
                  </Text>

                  {affected.map((d) => (
                    <Text key={`sum-${d}`} style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700" }}>
                      • {domainLabel(d)}: {counts?.[d] ?? 0}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
