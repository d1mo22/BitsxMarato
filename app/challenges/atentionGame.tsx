import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Button, 
  Alert, 
  ActivityIndicator, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice'; // Se usa para el reconocimiento de voz

// --- CONFIGURACIÓN DE LA PRUEBA ---
const START_DIGITS = 4; // Empezamos en 4 dígitos
const MAX_DIGITS = 9;   // Terminamos en 9 dígitos
const MAX_ERRORS = 3;   // Máximo total de errores

// Estados del flujo y métodos de entrada
type TestState = 'IDLE' | 'DICTATING' | 'LISTENING' | 'VALIDATING' | 'FINISHED';
type InputMethod = 'VOICE' | 'TEXT';

// Genera una secuencia aleatoria de números
const generateSequence = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
};

// Convierte un string de texto a un string de dígitos (simplificado)
const parseInputToDigits = (inputText: string): string => {
    // 1. Elimina espacios dobles y normaliza
    const normalized = inputText.trim().replace(/\s+/g, '');
    // En producción, se debería convertir "cinco" -> "5" si el input es de voz,
    // pero aquí simplemente eliminamos cualquier caracter que no sea dígito si fuera necesario.
    return normalized.replace(/[^0-9]/g, ''); 
};

export default function AttentionScreen() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(START_DIGITS);
  const [roundAttempts, setRoundAttempts] = useState(0); // 0 = 1er intento, 1 = 2do intento
  const [testState, setTestState] = useState<TestState>('IDLE');
  const [spokenText, setSpokenText] = useState('');
  const [textInput, setTextInput] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>('VOICE'); 
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- LÓGICA DE RECONOCIMIENTO DE VOZ (REACT-NATIVE-VOICE) ---

  useEffect(() => {
    // Configura los oyentes de eventos de voz
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Limpieza al desmontar el componente
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    const recognized = e.value[0] || '';
    setSpokenText(recognized);
    setIsRecognizing(false);
    if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
    
    // Pasa a la validación después de obtener el resultado
    validateAnswer(recognized);
  };

  const onSpeechError = (e: any) => {
    console.error('Error de voz:', e);
    setIsRecognizing(false);
    if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
    
    if (e.error?.message.includes('No match')) {
        Alert.alert('No se ha reconocido', 'No se pudo capturar la secuencia.');
        handleMistakeAndProgression(false);
    } else {
        Alert.alert('Error de Voz', 'Ha ocurrido un error en el reconocimiento.');
        setTestState('IDLE'); 
    }
  };
  
  const startListening = async () => {
    setSpokenText('');
    setTextInput('');
    setTestState('LISTENING');
    
    if (inputMethod === 'VOICE') {
        setIsRecognizing(true);
        try {
            await Voice.start('es-ES');
            
            // Establece un tiempo límite para la escucha
            recognitionTimeoutRef.current = setTimeout(() => {
                Voice.stop();
                setIsRecognizing(false);
                if (testState === 'LISTENING') {
                    Alert.alert('Tiempo agotado', 'No hubo respuesta. Fallo.');
                    handleMistakeAndProgression(false);
                }
            }, 6000); 

        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'No se pudo iniciar el micrófono. Verifica permisos.');
            setTestState('IDLE');
            setIsRecognizing(false);
        }
    }
    // Si es TEXT, el estado 'LISTENING' activará la interfaz de TextInput.
  };

  // --- LÓGICA DE PROGRESIÓN Y ESTADOS ---
  
  const startTest = () => {
    // Inicialización de la prueba completa
    Voice.stop(); 
    setErrors(0);
    setCurrentLevel(START_DIGITS);
    setRoundAttempts(0);
    startRound(START_DIGITS);
  };

  const startRound = (length: number) => {
    // Inicia una ronda en la longitud actual
    const newSequence = generateSequence(length);
    setSequence(newSequence);
    setTestState('DICTATING');
    dictateSequence(newSequence);
  };
  
  const startNextLevel = () => {
    // Lógica para pasar al siguiente nivel
    const nextLevel = currentLevel + 1;
    if (nextLevel <= MAX_DIGITS) {
        setCurrentLevel(nextLevel);
        setRoundAttempts(0); // Reinicia intentos para el nuevo nivel
        startRound(nextLevel);
    } else {
        Alert.alert('¡Éxito!', 'Has completado la prueba de Atención con éxito.');
        setTestState('FINISHED');
    }
  };

  const handleMistakeAndProgression = (isTotalFailure: boolean) => {
    const newErrors = errors + 1;
    setErrors(newErrors);

    if (newErrors > MAX_ERRORS) {
        Alert.alert('Prueba Fallida', `Has superado el límite de ${MAX_ERRORS} errores totales.`);
        setTestState('IDLE');
        setErrors(0);
        setCurrentLevel(START_DIGITS);
        setRoundAttempts(0);
        return;
    }

    if (currentLevel === START_DIGITS && roundAttempts === 0) {
        // Fallo en el Nivel 4, 1er intento: Permitir segundo intento
        setRoundAttempts(1);
        Alert.alert('Fallo', `Respuesta incorrecta. Tienes un segundo intento en ${START_DIGITS} dígitos.`);
        setTestState('IDLE'); 
    } else {
        // Fallo en niveles 5-9 O 2do fallo en nivel 4: Fallo de ronda, pasamos al siguiente nivel
        Alert.alert('Fallo', `Nivel ${currentLevel} fallido. Pasando a ${currentLevel + 1} dígitos.`);
        setRoundAttempts(0);
        startNextLevel(); 
    }
  };

  const submitTextAnswer = () => {
    if (textInput.length > 0) {
        validateAnswer(textInput);
    } else {
        Alert.alert('Aviso', 'Debes introducir la secuencia de números.');
    }
  };

  const validateAnswer = (userInput: string) => {
    setTestState('VALIDATING');
    
    // Normaliza la entrada de voz/texto a una cadena de dígitos
    const answerToCompare = parseInputToDigits(userInput);
    
    // Secuencia esperada como string de dígitos (Ej: [5, 8, 1] -> "581")
    const expectedSequence = sequence.join(''); 
    
    if (answerToCompare === expectedSequence) {
        // --- RESPUESTA CORRECTA ---
        Alert.alert('Correcto', `Nivel ${currentLevel} superado.`);
        setRoundAttempts(0); // Reinicia intentos por si venía de un segundo intento
        startNextLevel(); 
    } else {
        // --- RESPUESTA INCORRECTA ---
        handleMistakeAndProgression(false);
    }
  };

  const dictateSequence = async (seq: number[]) => {
    const sequenceString = seq.join(', '); 
    
    const options = {
      language: 'es', 
      rate: 0.7,      
    };

    try {
      await Speech.speak(`Nivel ${currentLevel}. Escucha atentamente la secuencia.`, options);
      await Speech.speak(sequenceString, options);
      
      startListening(); 

    } catch (error) {
      Alert.alert('Error TTS', 'No se pudo dictar la secuencia.');
      setTestState('IDLE');
    }
  };

  // --- RENDERIZADO DE LA PANTALLA ---

  const renderContent = () => {
    const buttonTitle = currentLevel > START_DIGITS || errors > 0 
        ? `Continuar (Nivel ${currentLevel})` 
        : "Empezar Prueba";

    switch (testState) {
      case 'IDLE':
        return (
          <View>
            <Text style={styles.title}>Test de Atención: Secuencia Directa</Text>
            <Text style={styles.instructions}>Memoriza la secuencia y repítela en el orden exacto.</Text>
            
            <Text style={styles.label}>Nivel Actual: {currentLevel} dígitos</Text>
            
            {/* Selector de Método de Entrada */}
            <Text style={styles.label}>Método de Respuesta:</Text>
            <View style={styles.inputMethodContainer}>
              <TouchableOpacity
                style={[styles.methodButton, inputMethod === 'VOICE' && styles.methodButtonActive]}
                onPress={() => setInputMethod('VOICE')}
              >
                <Text style={[styles.methodButtonText, inputMethod === 'VOICE' && styles.methodButtonTextActive]}>Voz</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.methodButton, inputMethod === 'TEXT' && styles.methodButtonActive]}
                onPress={() => setInputMethod('TEXT')}
              >
                <Text style={[styles.methodButtonText, inputMethod === 'TEXT' && styles.methodButtonTextActive]}>Texto</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.errorText}>Fallos totales: {errors}/{MAX_ERRORS}</Text>
            <Button 
                title={buttonTitle}
                onPress={() => startRound(currentLevel)}
                color="#007bff" 
            />
          </View>
        );
      case 'DICTATING':
        return (
          <View style={styles.center}>
            <Text style={styles.infoText}>Escuchando la secuencia...</Text>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.sequenceText}>{sequence.join(' ')}</Text>
          </View>
        );
      case 'LISTENING':
        return (
          <View style={styles.center}>
            <Text style={styles.infoText}>¡Tu turno! Repite la secuencia.</Text>
            
            {inputMethod === 'VOICE' ? (
              // --- INTERFAZ DE VOZ ---
              <View style={styles.center}>
                <ActivityIndicator size="large" color="#28a745" animating={isRecognizing} />
                <Text style={styles.spokenText}>{isRecognizing ? 'Habla ahora...' : `Último reconocido: ${spokenText}`}</Text>
              </View>
            ) : (
              // --- INTERFAZ DE TEXTO ---
              <View style={styles.center}>
                <TextInput
                  style={styles.textInputStyle}
                  onChangeText={setTextInput}
                  value={textInput}
                  placeholder="Escribe la secuencia (ej: 581)"
                  keyboardType="number-pad"
                  autoFocus={true}
                />
                <Button 
                  title="Validar Respuesta" 
                  onPress={submitTextAnswer} 
                  color="#28a745"
                  disabled={textInput.length === 0}
                />
              </View>
            )}
          </View>
        );
      case 'VALIDATING':
        return <Text style={styles.infoText}>Validando respuesta...</Text>;
      case 'FINISHED':
        return (
          <View style={styles.center}>
            <Text style={styles.successText}>¡Prueba de Atención Completada!</Text>
            <Button title="Volver al Inicio" onPress={() => setTestState('IDLE')} color="#007bff" />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    instructions: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#6c757d',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
        color: '#dc3545',
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 15,
        color: '#007bff',
    },
    sequenceText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#007bff',
    },
    spokenText: {
        fontSize: 16,
        marginTop: 10,
        color: '#6c757d',
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 20,
    },
    center: {
        alignItems: 'center',
    },
    // Estilos para el selector de método de entrada
    inputMethodContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    methodButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#e9ecef', 
        borderWidth: 1,
        borderColor: '#ced4da',
    },
    methodButtonActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    methodButtonText: {
        color: '#495057', 
        fontWeight: '600',
    },
    methodButtonTextActive: {
        color: '#fff',
    },
    // Estilo para la entrada de texto manual
    textInputStyle: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        width: 250,
        marginBottom: 15,
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
});