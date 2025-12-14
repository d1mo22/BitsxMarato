import { Colors } from '@/constants/colors';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import Voice from '@react-native-voice/voice';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Turn = 'letter' | 'category';

const TOTAL_TIME = 60;
const GAME_ID = 'VERBAL_FLUENCY_LAST_PLAYED';

const LETTER_POOL = 'ABCDEFGHILMNOPQRSTUVZ'.split('');

export default function VerbalFluencyGame() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isActive, setIsActive] = useState(true);
  const { colors: theme, isDark } = useTheme();

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [turn, setTurn] = useState<Turn>('letter');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const [letter, setLetter] = useState('P');
  const [categoryId, setCategoryId] = useState<
    'animals' | 'fruits' | 'colors' | 'cities' | 'jobs' | 'objects' | 'food'
  >('animals');

  const [listening, setListening] = useState(false);
  const [partial, setPartial] = useState<string | null>(null);
  const [lastWord, setLastWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const keepListening = useRef(false);
  const lastPartial = useRef<string | null>(null);
  const turnRef = useRef<Turn>('letter');
  const usedRef = useRef<string[]>([]);
  const lastWordRef = useRef<string | null>(null); // ✅ Nueva ref para evitar duplicados inmediatos
  const startTime = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const listeningRef = useRef(false); // ✅ Ref para estado síncrono del mic

  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);
  useEffect(() => {
    usedRef.current = usedWords;
  }, [usedWords]);
  useEffect(() => {
    lastWordRef.current = lastWord;
  }, [lastWord]);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (listening) {
      pulseScale.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true);
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [listening]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const normalize = (s: string) =>
    s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const CATEGORIES = useMemo(() => {
    const mk = (label: string, words: string[]) => ({
      label,
      set: new Set(words.map(normalize)),
    });

    return {
      animals: mk('Animal', [
        'perro', 'gato', 'caballo', 'vaca', 'oveja', 'cerdo', 'conejo', 'leon', 'tigre', 'elefante',
        'jirafa', 'mono', 'lobo', 'zorro', 'oso', 'pato', 'gallina', 'pollo', 'aguila', 'halcon',
        'paloma', 'cuervo', 'pez', 'tiburon', 'delfin', 'ballena', 'foca', 'morsa', 'pulpo', 'calamar',
        'tortuga', 'serpiente', 'cobra', 'lagarto', 'iguana', 'camaleon', 'rana', 'sapo',
        'cocodrilo', 'caiman', 'hipopotamo', 'rinoceronte', 'cebra', 'camello', 'burro',
        'raton', 'rata', 'hamster', 'erizo', 'ardilla', 'murcielago',
      ]),
      fruits: mk('Fruta', [
        'manzana', 'pera', 'platano', 'banana', 'naranja', 'mandarina', 'limon', 'pomelo', 'uva', 'kiwi',
        'mango', 'papaya', 'pina', 'piña', 'coco', 'fresa', 'frutilla', 'cereza', 'ciruela', 'melocoton',
        'durazno', 'albaricoque', 'nectarina', 'granada', 'higo', 'caqui', 'lichi', 'maracuya',
        'guanabana', 'chirimoya', 'tamarindo', 'arandano', 'mora', 'frambuesa', 'grosella',
        'sandia', 'melon', 'aguacate', 'palta', 'aceituna', 'datil', 'higo chumbo',
        'carambola', 'pitaya', 'yuzu', 'kumquat', 'membrillo', 'noni', 'jaboticaba',
      ]),
      colors: mk('Color', [
        'rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'morado', 'violeta',
        'rosa', 'naranja', 'marron', 'beige', 'turquesa', 'cian', 'magenta',
      ]),
      cities: mk('Ciudad', [
        'barcelona', 'madrid', 'valencia', 'sevilla', 'zaragoza', 'malaga', 'granada', 'cordoba',
        'bilbao', 'san sebastian', 'vitoria', 'pamplona', 'logroño', 'santander', 'oviedo', 'gijon',
        'leon', 'burgos', 'valladolid', 'salamanca', 'segovia', 'avila', 'toledo', 'cuenca',
        'albacete', 'murcia', 'alicante', 'elche', 'castellon', 'tarragona', 'reus',
        'girona', 'lleida', 'manresa', 'vic', 'figueres', 'ibiza', 'palma', 'mahon',
        'paris', 'londres', 'roma', 'milano', 'venecia', 'florencia', 'berlin', 'munich',
        'viena', 'praga', 'budapest', 'varsovia', 'lisboa', 'porto', 'bruselas', 'amsterdam',
      ]),
      jobs: mk('Profesión', [
        'medico', 'doctora', 'enfermera', 'auxiliar', 'psicologo', 'psiquiatra', 'fisioterapeuta',
        'dentista', 'higienista', 'farmaceutico', 'veterinario',
        'profesor', 'maestro', 'docente', 'educador', 'pedagogo',
        'ingeniero', 'arquitecto', 'aparejador', 'programador', 'desarrollador',
        'analista', 'tecnico', 'electricista', 'fontanero', 'mecanico',
        'cocinero', 'chef', 'panadero', 'pastelero', 'camarero', 'sumiller',
        'abogado', 'juez', 'fiscal', 'notario', 'procurador',
        'policia', 'guardia', 'bombero', 'militar', 'soldado',
        'periodista', 'redactor', 'reportero', 'fotografo',
        'actor', 'actriz', 'director', 'productor', 'guionista',
        'disenador', 'ilustrador', 'animador', 'editor',
        'economista', 'contable', 'auditor', 'administrativo',
      ]),
      food: mk('Alimento', [
        'pan', 'arroz', 'pasta', 'macarrones', 'espaguetis', 'pizza', 'hamburguesa', 'bocadillo',
        'sopa', 'caldo', 'pure', 'ensalada', 'lentejas', 'garbanzos', 'judias', 'alubias',
        'pollo', 'ternera', 'cerdo', 'cordero', 'pavo', 'jamon', 'chorizo', 'salchicha',
        'pescado', 'atun', 'salmon', 'merluza', 'bacalao', 'sardina', 'boqueron',
        'huevo', 'tortilla', 'queso', 'yogur', 'leche', 'mantequilla', 'nata',
        'aceite', 'vinagre', 'sal', 'azucar', 'miel',
        'patata', 'patatas', 'tomate', 'cebolla', 'ajo', 'zanahoria', 'calabacin',
        'berenjena', 'pimiento', 'brocoli', 'coliflor', 'espinaca', 'lechuga',
        'chocolate', 'galleta', 'bizcocho', 'pastel', 'tarta', 'helado', 'flan',
      ]),
    };
  }, []);

  const categoryLabel = CATEGORIES[categoryId]?.label ?? 'Categoría';

  useEffect(() => {
    const randomLetter = LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)] ?? 'P';
    const keys = Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>;
    const randomCategory = keys[Math.floor(Math.random() * keys.length)] ?? 'animals';

    setLetter(randomLetter);
    setCategoryId(randomCategory);

    setStarted(false);
    setTimeLeft(TOTAL_TIME);
    setTurn('letter');
    setUsedWords([]);
    setScore(0);
    setPartial(null);
    setLastWord(null);
    setError(null);

    keepListening.current = false;
    try { Voice.stop(); } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (text: string) => {
    const word = normalize(text).split(/\s+/).pop();
    if (!word) return;

    // ✅ Evitar procesar la misma palabra dos veces seguidas (rebote del micrófono)
    if (word === lastWordRef.current) return;

    if (usedRef.current.includes(word)) {
      setError('Palabra repetida');
      return;
    }

    if (turnRef.current === 'letter') {
      if (!word.startsWith(letter.toLowerCase())) {
        setError(`Debe empezar por "${letter}"`);
        return;
      }
    } else {
      const set = CATEGORIES[categoryId].set;
      if (!set.has(word)) {
        setError(`Debe ser: ${categoryLabel} (lista básica)`);
        return;
      }
    }

    setError(null);
    setLastWord(word);
    lastWordRef.current = word; // ✅ Actualización inmediata

    setUsedWords((p) => [...p, word]);
    usedRef.current.push(word); // ✅ Actualización inmediata

    setScore((p) => p + 1);

    const nextTurn = turnRef.current === 'letter' ? 'category' : 'letter';
    setTurn(nextTurn);
    turnRef.current = nextTurn; // ✅ Actualización inmediata
  };

  const finishGame = async () => {
    stopAll();

    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(GAME_ID, today).catch((e) =>
      console.error('Error saving game date', e)
    );

    router.replace({
      pathname: '/games/verbal-fluency/result',
      params: {
        correctWords: String(score),
      },
    });
  };

  const startTimer = () => {
    if (timerRef.current) return;
    startTime.current = Date.now();

    timerRef.current = setInterval(() => {
      if (!startTime.current) return;

      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const left = Math.max(TOTAL_TIME - elapsed, 0);
      setTimeLeft(left);

      if (left === 0) {
        finishGame();
      }
    }, 250);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTime.current = null;
  };

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setListening(true);
      listeningRef.current = true;
      setPartial(null);
    };

    Voice.onSpeechPartialResults = (e) => {
      const t = e.value?.[0];
      if (t) {
        setPartial(t);
        lastPartial.current = t;
        validate(t); // ✅ Validar en tiempo real para reducir latencia
      }
    };

    Voice.onSpeechResults = async (e) => {
      const t = e.value?.[0];
      if (!t) return;

      validate(t);
      lastPartial.current = null;

      // Al recibir resultados finales, paramos el motor.
      // El reinicio se delega EXCLUSIVAMENTE a onSpeechEnd para evitar condiciones de carrera.
      try { await Voice.stop(); } catch { }
    };

    Voice.onSpeechEnd = () => {
      setListening(false);
      listeningRef.current = false;
      if (lastPartial.current) {
        validate(lastPartial.current);
        lastPartial.current = null;
      }

      // ✅ Único punto de reinicio para evitar llamadas dobles a Voice.start()
      setTimeout(() => {
        if (keepListening.current && !listeningRef.current) {
          Voice.start('es-ES').catch(() => { });
        }
      }, 250);
    };

    Voice.onSpeechError = (e) => {
      setListening(false);
      listeningRef.current = false;
      if (keepListening.current) {
        // ✅ Más tiempo de recuperación ante errores
        setTimeout(() => {
          if (!listeningRef.current) {
            Voice.start('es-ES').catch(() => { });
          }
        }, 500);
      }
    };

    return () => {
      stopAll();
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, categoryId, categoryLabel]);

  const startAll = async () => {
    setError(null);
    setStarted(true);
    setTimeLeft(TOTAL_TIME);
    startTimer();
    keepListening.current = true;

    try {
      await Voice.start('es-ES');
    } catch {
      Alert.alert('Error', 'No se pudo iniciar el micrófono');
    }
  };

  const stopAll = async () => {
    keepListening.current = false;
    setListening(false);
    listeningRef.current = false;
    setPartial(null);
    stopTimer();
    try { await Voice.stop(); } catch { }
  };

  const toggleMic = () => {
    if (!started || !keepListening.current) startAll();
    else stopAll();
  };

  const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME;
  const circumference = 2 * Math.PI * 46;

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: theme.background }]}>
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={[globalStyles.iconButton, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={{ color: theme.textSecondary }}>{score} pts</Text>
      </View>

      <View style={styles.content}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', textAlign: 'center', paddingHorizontal: 20 }}>
          {turn === 'letter'
            ? `Di una palabra que empiece por ${letter}`
            : `Di una palabra de la categoría: ${categoryLabel}`}
        </Text>

        <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
          Letra: <Text style={{ color: theme.primary, fontWeight: '900' }}>{letter}</Text> ·
          Categoría: <Text style={{ color: theme.primary, fontWeight: '900' }}> {categoryLabel}</Text>
        </Text>

        <View style={styles.timerContainer}>
          <Animated.View style={[styles.pulseBackground, animatedPulseStyle, { backgroundColor: 'rgba(54, 226, 123, 0.2)' }]} />

          <Svg width="256" height="256" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx="50" cy="50" r="46" stroke={Colors.gray300} strokeWidth="2" fill="none" />
            <Circle
              cx="50"
              cy="50"
              r="46"
              stroke={theme.primary}
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * progress}
              strokeLinecap="round"
            />
          </Svg>

          <TouchableOpacity style={styles.micButton} onPress={toggleMic} activeOpacity={0.85}>
            <MaterialIcons
              name={keepListening.current ? (listening ? 'graphic-eq' : 'stop') : 'mic'}
              size={64}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {!!partial && <Text style={{ color: theme.textSecondary }}>Detectando: {partial}</Text>}
        {!!lastWord && <Text style={{ color: theme.primary, fontSize: 20, fontWeight: '900' }}>{lastWord.charAt(0).toUpperCase() + lastWord.slice(1)}</Text>}
        {!!error && <Text style={{ color: theme.error, fontWeight: '800' }}>{error}</Text>}

        <Text style={{ color: theme.textSecondary }}>Tiempo: {timeLeft}s</Text>

        <Text style={{ color: theme.textSecondary, fontSize: 12, paddingHorizontal: 18, textAlign: 'center' }}>
          Usadas: {usedWords.length ? usedWords.join(', ') : '—'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingBottom: 18 },
  timerContainer: { width: 256, height: 256, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  pulseBackground: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(54,226,123,0.18)',
  },
  micButton: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
