import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bitsxmarato:cogForm:v2";

export type Domain = "atencio" | "velocitat" | "fluencia" | "memoria" | "executives";

export type CogFormState = {
  mood: "bien" | "regular" | "mal" | null;
  // Aquí guardem les afirmacions marcades (true/false)
  items: Record<string, boolean>;
  notes: string;
  updatedAt: number | null;
};

const DEFAULT_STATE: CogFormState = {
  mood: null,
  items: {
    room_forget: false,
    slow_activity: false,
    word_block: false,
    lose_thread: false,
    recent_forget: false,
    longterm_forget: false,
    decision_hard: false,
    plan_day: false,
    brain_fog: false,
    think_slower: false,
  },
  notes: "",
  updatedAt: null,
};

async function loadState(): Promise<CogFormState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_STATE;

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      items: { ...DEFAULT_STATE.items, ...(parsed?.items ?? {}) },
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

  const toggleItem = useCallback((key: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        items: { ...prev.items, [key]: !prev.items[key] },
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

  return { state, ready, setMood, toggleItem, setNotes, reset };
}
