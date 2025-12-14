import { Colors } from "@/constants/colors";
import { useTheme } from "@/hooks/use-theme";
import { globalStyles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFormStore, Domain } from "@/app/stores/formStore";

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

function recommendationsFor(domain: Domain) {
  switch (domain) {
    case "atencio":
      return [
        "Hoy es un buen día para hacer algo de deporte, quizás ir a caminar un rato o alguna otra actividad que te apetezca",
        "Esta semana es ideal para hacer alguna manualidad, pon mucha atención en lo que haces, quizás un dibujo, un puzle, coser algo, etc.",
        "Si tienes un rato, lee un texto corto (una noticia, un párrafo de un libro) e intenta comprenderlo detenidamente. Puedes subrayar mentalmente las ideas importantes para mantenerte concentrado.",
      ];
    case "velocitat":
      return ["Reduce la multitarea: 1 cosa a la vez.", "Empieza por una tarea fácil para coger ritmo."];
    case "fluencia":
      return [
        "Hoy es un buen día para hacer algo de deporte, quizás ir a caminar un rato o alguna otra actividad que te apetezca",
        "Hoy durante 5 minutos tienes que ir diciendo los objetos que ves a tu alrededor",
        "Piensa durante unos minutos cuántas frutas y verduras hay de color rojo",
      ];
    case "memoria":
      return [
        "Hoy es un buen día para hacer algo de deporte, quizás ir a caminar un rato o alguna otra actividad que te apetezca",
        "Esta semana es ideal para volver a hacer aquella receta que has dejado de hacer y te salía tan bien...",
        "¡Prueba a aprender algunas palabras de un nuevo idioma, quizás un idioma que ya sepas un poco o uno completamente nuevo!",
      ];
    case "executives":
      return [
        "Trata de ponerte como objetivo hacer 3 cosas hoy",
        "Tienes que pensar cómo planificarte, qué decidirás hacer primero",
        "Empieza por lo que puedas hacer más rápido o lo que te desbloquee el resto.",
      ];
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors: theme, isDark } = useTheme();

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

      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={[globalStyles.titleContainer, { marginTop: 16 }]}>
          <Text style={[globalStyles.title, { color: theme.text }]}>Hola, Ana.</Text>
          <Text style={[globalStyles.subtitle, { color: theme.textSecondary }]}>¿Cómo te sientes hoy?</Text>
        </View>

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
            marginBottom: 10,
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
              marginRight: 12,
            }}
          >
            <MaterialIcons name="assignment" size={24} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Formulario</Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: "700", marginTop: 2 }}>
              ¿Qué te ha pasado ahora?
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
            marginBottom: 10,
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
              marginRight: 12,
            }}
          >
            <MaterialIcons name="sports-esports" size={24} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Juegos</Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontWeight: "700", marginTop: 2 }}>
              Recuerda hacer los tests
            </Text>
          </View>

          <MaterialIcons name="chevron-right" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Recomendaciones */}
        <View
          style={{
            borderRadius: 18,
            padding: 16,
            marginHorizontal: 16,
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            borderWidth: 1,
            borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: isDark ? "rgba(54,226,123,0.14)" : "rgba(54,226,123,0.16)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <MaterialIcons name="tips-and-updates" size={24} color={Colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: "900", fontSize: 16 }}>Recomendaciones</Text>
              <Text style={{ color: theme.textSecondary, fontWeight: "700", marginTop: 2 }}>
                Basadas en lo que has marcado hoy ({today})
              </Text>
            </View>
          </View>

          {!ready ? (
            <Text style={stylesRec.textSmall(theme)}>Cargando…</Text>
          ) : affected.length === 0 ? (
            <Text style={stylesRec.textSmall(theme)}>
              Todavía no has marcado ningún episodio hoy. Ve al formulario y toca lo que te haya pasado.
            </Text>
          ) : (
            <View>
              {affected.map((d) => (
                <View key={d} style={{ marginBottom: 14 }}>
                  <Text style={{ color: theme.text, fontWeight: "900", marginBottom: 6 }}>
                    {domainLabel(d)}{" "}
                    <Text style={{ color: theme.textSecondary, fontWeight: "800" }}>
                      ({counts?.[d] ?? 0})
                    </Text>
                  </Text>

                  {recommendationsFor(d).map((r, i) => (
                    <Text key={`${d}-${i}`} style={stylesRec.bullet(theme)}>
                      • {r}
                    </Text>
                  ))}
                </View>
              ))}

              <View style={{ marginTop: 2 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "800", marginBottom: 6 }}>
                  Resumen de hoy:
                </Text>

                {affected.map((d) => (
                  <Text
                    key={`sum-${d}`}
                    style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700", marginBottom: 3 }}
                  >
                    • {domainLabel(d)}: {counts?.[d] ?? 0}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesRec = {
  bullet: (theme: any) => ({
    color: theme.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
    marginBottom: 6,
  }),
  textSmall: (theme: any) => ({
    color: theme.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
  }),
};
