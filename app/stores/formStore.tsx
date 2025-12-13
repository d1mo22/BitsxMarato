import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bitsxmarato:cogForm:v3";

export type Domain = "atencio" | "velocitat" | "fluencia" | "memoria" | "executives";

export type DailyCounts = Record<string, Record<string, number>>;
// daily["2025-12-13"]["room_forget"] = 2

export type CogFormState = {
  mood: "bien" | "regular" | "mal" | null;
  daily: DailyCounts;
  notes: string;
  updatedAt: number | null;
};

const DEFAULT_STATE: CogFormState = {
  mood: null,
  daily: {},
  notes: "",
  updatedAt: null,
};

function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function loadState(): Promise<CogFormState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      daily: { ...(parsed?.daily ?? {}) },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function saveState(state: CogFormState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useFormStore() {
  const [state, setState] = useState<CogFormState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  const today = useMemo(() => dayKey(), []);

  useEffect(() => {
    (async () => {
      const s = await loadState();
      setState(s);
      setReady(true);
    })();
  }, []);

  const setMood = useCallback((mood: CogFormState["mood"]) => {
    setState((prev) => {
      const next = { ...prev, mood, updatedAt: Date.now() };
      void saveState(next);
      return next;
    });
  }, []);

  // ✅ suma +1 a la pregunta del día
  const incrementItem = useCallback((key: string) => {
    setState((prev) => {
      const t = dayKey();
      const dayCounts = { ...(prev.daily[t] ?? {}) };
      dayCounts[key] = (dayCounts[key] ?? 0) + 1;

      const next: CogFormState = {
        ...prev,
        daily: { ...prev.daily, [t]: dayCounts },
        updatedAt: Date.now(),
      };

      void saveState(next);
      return next;
    });
  }, []);

  // ✅ (opcional) restar (si luego lo quieres)
  const decrementItem = useCallback((key: string) => {
    setState((prev) => {
      const t = dayKey();
      const dayCounts = { ...(prev.daily[t] ?? {}) };
      const current = dayCounts[key] ?? 0;
      dayCounts[key] = Math.max(current - 1, 0);

      const next: CogFormState = {
        ...prev,
        daily: { ...prev.daily, [t]: dayCounts },
        updatedAt: Date.now(),
      };

      void saveState(next);
      return next;
    });
  }, []);

  const setNotes = useCallback((notes: string) => {
    setState((prev) => {
      const next = { ...prev, notes, updatedAt: Date.now() };
      void saveState(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(() => {
      void saveState(DEFAULT_STATE);
      return DEFAULT_STATE;
    });
  }, []);

  const getTodayCount = useCallback(
    (key: string) => {
      const t = dayKey();
      return state.daily[t]?.[key] ?? 0;
    },
    [state.daily]
  );

  return {
    state,
    ready,
    today,
    setMood,
    incrementItem,
    decrementItem, // lo dejamos por si lo quieres luego
    setNotes,
    reset,
    getTodayCount,
  };
}
