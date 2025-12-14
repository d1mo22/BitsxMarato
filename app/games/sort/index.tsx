import { Colors } from "@/constants/colors";
import { useTheme } from "@/hooks/use-theme";
import { globalStyles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, LayoutChangeEvent, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
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
    // ✅ Esto es texto de ejemplo (puedes cambiarlo por links/videos)
    switch (domain) {
        case "atencio":
            return [
                "Fes 2 minuts de respiració abans de començar una tasca.",
                "Treballa en blocs de 10–15 min i descansa 1–2 min.",
            ];
        case "velocitat":
            return [
                "Redueix multitarea: 1 cosa cada cop.",
                "Comença per una tasca fàcil per agafar ritme.",
            ];
        case "fluencia":
            return [
                "Juga 1 minut a categories (fruites, animals, ciutats…).",
                "Llegeix en veu alta 2 minuts i resumeix 1 frase.",
            ];
        case "memoria":
            return [
                "Apunta 3 coses clau del dia (notes curtes).",
                "Repeteix informació important en veu alta (2 vegades).",
            ];
        case "executives":
            return [
                "Defineix 1 objectiu petit per la propera hora.",
                "Fes una llista de 3 passos (màxim) i executa’ls.",
            ];
    }
}

export default function HomeScreen() {
    const router = useRouter();
    const { colors: theme, isDark } = useTheme();
    const [chartWidth, setChartWidth] = useState(0);

    const { ready, today, refresh, getAffectedDomainsForDay } = useFormStore();

    // ✅ Opción A: cada vez que vuelves a Home, recarga AsyncStorage
    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const { affected, counts } = useMemo(() => {
        if (!ready) return { affected: [] as Domain[], counts: null as any };
        return getAffectedDomainsForDay(today);
    }, [ready, getAffectedDomainsForDay, today]);

    const topDomain = affected[0] ?? null;

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
            <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={[globalStyles.titleContainer, { marginTop: 16 }]}>
                    <Text style={[globalStyles.title, { color: theme.text }]}>Hola, Ana.</Text>
                    <Text style={[globalStyles.subtitle, { color: theme.textSecondary }]}>¿Cómo te sientes hoy?</Text>
                </View>
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
                        <View style={{ gap: 10 }}>
                            <Text style={{ color: theme.text, fontWeight: "900" }}>
                                Àrea principal: {topDomain ? domainLabel(topDomain) : "—"}
                            </Text>

                            {topDomain && (
                                <View style={{ gap: 6 }}>
                                    {recommendationsFor(topDomain).map((r, i) => (
                                        <Text
                                            key={i}
                                            style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "600" }}
                                        >
                                            • {r}
                                        </Text>
                                    ))}
                                </View>
                            )}

                            <View style={{ marginTop: 4, gap: 6 }}>
                                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "800" }}>
                                    Resum d’avui:
                                </Text>
                                {affected.map((d) => (
                                    <Text key={d} style={{ color: theme.textSecondary, fontSize: 12, fontWeight: "700" }}>
                                        • {domainLabel(d)}: {counts[d]}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

            </View>
        </SafeAreaView>
    );
}