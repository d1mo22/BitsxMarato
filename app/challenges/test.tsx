import Voice, {
    SpeechResultsEvent,
    SpeechRecognizedEvent,
    SpeechErrorEvent,
} from '@react-native-voice/voice'; // Se usa para el reconocimiento de voz
import { useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';


export default function VoiceChallenge() {
    const [recognized, setRecognized] = useState("");
    const [pitch, setPitch] = useState("");
    const [error, setError] = useState("");
    const [end, setEnd] = useState("");
    const [started, setStarted] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [partialResults, setPartialResults] = useState<string[]>([]);

    useEffect(() => {
        Voice.onSpeechStart = (e) => {
            console.log("onSpeechStart: ", e);
            setStarted("√");
        };

        Voice.onSpeechRecognized = (e) => {
            console.log("onSpeechRecognized: ", e);
            setRecognized("√");
        };

        Voice.onSpeechEnd = (e) => {
            console.log("onSpeechEnd: ", e);
            setEnd("√");
        };

        Voice.onSpeechError = (e) => {
            console.log("onSpeechError: ", e);
            setError(JSON.stringify(e.error));
        };

        Voice.onSpeechResults = (e) => {
            console.log("onSpeechResults: ", e);
            setResults(e.value || []);
        };

        Voice.onSpeechPartialResults = (e) => {
            console.log("onSpeechPartialResults: ", e);
            setPartialResults(e.value || []);
        };

        Voice.onSpeechVolumeChanged = (e) => {
            console.log("onSpeechVolumeChanged: ", e);
            setPitch(e.value?.toString() || "");
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const startRecognizing = async () => {
        try {
            await Voice.start("es-ES");
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    const cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    };

    const destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
        resetStates();
    };

    const resetStates = () => {
        setRecognized("");
        setPitch("");
        setError("");
        setStarted("");
        setResults([]);
        setPartialResults([]);
        setEnd("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
            <Text style={styles.instructions}>Press the button and start speaking.</Text>
            <Text style={styles.stat}>{`Started: ${started}`}</Text>
            <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
            <Text style={styles.stat}>{`Pitch: ${pitch}`}</Text>
            <Text style={styles.stat}>{`Error: ${error}`}</Text>
            <Text style={styles.stat}>Results</Text>
            {results.map((result, index) => (
                <Text key={`result-${index}`} style={styles.stat}>{result}</Text>
            ))}
            <Text style={styles.stat}>Partial Results</Text>
            {partialResults.map((result, index) => (
                <Text key={`partial-result-${index}`} style={styles.stat}>{result}</Text>
            ))}
            <Text style={styles.stat}>{`End: ${end}`}</Text>

            <TouchableHighlight onPress={startRecognizing}>
                <Text style={styles.action}>Start</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={stopRecognizing}>
                <Text style={styles.action}>Stop Recognizing</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={cancelRecognizing}>
                <Text style={styles.action}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={destroyRecognizer}>
                <Text style={styles.action}>Destroy</Text>
            </TouchableHighlight>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        marginTop: 33,
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    action: {
        textAlign: "center",
        color: "#0000FF",
        marginVertical: 5,
        fontWeight: "bold",
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
    stat: {
        textAlign: "center",
        color: "#B0171F",
        marginBottom: 1,
    },
});