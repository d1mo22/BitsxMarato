# BitsxMarato - App de Bienestar Cognitivo

Aplicacion movil desarrollada para el hackathon **BitsxMarato** que ayuda a los usuarios a monitorear y ejercitar su salud cognitiva mediante juegos interactivos y seguimiento personalizado.

## Caracteristicas

### Juegos Cognitivos

La aplicacion incluye 4 juegos disenados para ejercitar diferentes dominios cognitivos:

| Juego | Dominio | Descripcion |
|-------|---------|-------------|
| **Fluencia Verbal** | Lenguaje | Reto de agilidad mental alternando palabras |
| **Atencion** | Memoria | Memoriza y repite secuencias numericas |
| **Velocidad** | Procesamiento | Encuentra numeros en orden ascendente |
| **Memoria Inversa** | Memoria de trabajo | Repite secuencias de numeros al reves |

### Formulario de Seguimiento

Permite a los usuarios registrar episodios y sintomas diarios relacionados con:
- Atencion
- Velocidad de procesamiento
- Fluidez verbal
- Memoria
- Funciones ejecutivas

### Recomendaciones Personalizadas

Basadas en los episodios registrados, la app genera recomendaciones diarias para mejorar las areas cognitivas afectadas.

## Tecnologias

- **React Native** con **Expo** (SDK 54)
- **TypeScript**
- **Expo Router** (file-based routing)
- **React Native Voice** para reconocimiento de voz
- Soporte para **iOS**, **Android** y **Web**
- Modo claro/oscuro automatico

## Inicio Rapido

### Requisitos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Para desarrollo nativo: Xcode (iOS) o Android Studio (Android)

### Instalacion

1. Clona el repositorio:
   ```bash
   git clone https://github.com/d1mo22/BitsxMarato.git
   cd BitsxMarato
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicacion:
   ```bash
   npx expo start
   ```

### Opciones de Ejecucion

- **Expo Go**: Escanea el codigo QR con la app Expo Go
- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Estructura del Proyecto

```
BitsxMarato/
├── app/
│   ├── (tabs)/           # Pantallas principales (tabs)
│   │   ├── index.tsx     # Home - Inicio
│   │   ├── games.tsx     # Lista de juegos
│   │   ├── form.tsx      # Formulario de seguimiento
│   │   └── wellness.tsx  # Bienestar
│   ├── games/            # Juegos cognitivos
│   │   ├── atention/     # Juego de atencion
│   │   ├── reves/        # Memoria inversa
│   │   ├── sort/         # Velocidad de procesamiento
│   │   └── verbal-fluency/ # Fluencia verbal
│   └── stores/           # Estado global (Zustand-like)
├── components/           # Componentes reutilizables
├── constants/            # Colores y temas
├── hooks/                # Custom hooks
└── styles/               # Estilos globales
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run android` | Ejecuta en Android |
| `npm run ios` | Ejecuta en iOS |
| `npm run web` | Ejecuta en navegador web |
| `npm run lint` | Ejecuta el linter |

## Permisos Requeridos

La aplicacion requiere los siguientes permisos para funcionar correctamente:

- **Microfono**: Para los juegos con reconocimiento de voz
- **Internet**: Para cargar recursos y sincronizacion

## Licencia

Proyecto desarrollado para BitsxMarato 2025.
