import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "bitsxmarato:games:v1";

export type GameId = "verbal-fluency" | "atention" | "sort" | "reves";

export type GameState = {
    history: Record<string, GameId[]>; // "YYYY-MM-DD": ["game1", "game2"]
};

const DEFAULT_STATE: GameState = {
    history: {},
};

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

export function useGameStore() {
    const [state, setState] = useState<GameState>(DEFAULT_STATE);
    const [ready, setReady] = useState(false);

    const load = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) {
                setState(JSON.parse(raw));
            }
        } catch (e) {
            console.error("Failed to load game store", e);
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const save = useCallback(async (newState: GameState) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            setState(newState);
        } catch (e) {
            console.error("Failed to save game store", e);
        }
    }, []);

    const markGameCompleted = useCallback(
        async (gameId: GameId) => {
            const today = getTodayKey();
            const currentHistory = state.history[today] || [];

            if (!currentHistory.includes(gameId)) {
                const newHistory = {
                    ...state.history,
                    [today]: [...currentHistory, gameId],
                };
                await save({ history: newHistory });
            }
        },
        [state, save]
    );

    const getDailyProgress = useCallback(() => {
        const today = getTodayKey();
        const completedGames = state.history[today] || [];
        return {
            completedCount: completedGames.length,
            completedGames,
            totalTarget: 4, // Meta diaria de 3 juegos
        };
    }, [state]);

    return {
        state,
        ready,
        markGameCompleted,
        getDailyProgress,
        refresh: load,
    };
}
