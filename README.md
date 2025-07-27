# Wompi Chat UI

Interfaz de chat web para interactuar con el asistente virtual de Wompi.

## Características

- 💬 **Chat en tiempo real** con el asistente de Wompi
- 🎨 **Interfaz moderna** construida con Next.js y Tailwind CSS
- 📱 **Responsive design** que funciona en desktop y móvil  
- 🔍 **Visualización de fuentes** muestra de dónde viene la información
- ⚡ **Conexión en vivo** con indicador de estado del backend
- 🎯 **Experiencia optimizada** con auto-scroll y loading states

## Requisitos

- Node.js 18+ 
- Backend RAG ejecutándose en puerto 3000

## Instalación

```bash
# Desde el directorio wompi-chat-ui
npm install
```

## Configuración

```bash
# Copia el archivo de configuración
cp .env.example .env.local

# Edita .env.local si el backend está en otra URL
```

## Uso

### Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3001

### Producción
```bash
npm run build
npm start
```

## Arquitectura

```
wompi-chat-ui/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Página principal
│   └── components/
│       └── ChatInterface.tsx  # Componente principal del chat
├── .env.local              # Variables de entorno
└── package.json
```

## Funcionalidades

### Chat Interface
- Envío de mensajes con Enter
- Indicador de "escribiendo..."
- Historial de conversación
- Timestamp en mensajes

### Fuentes de información
- Muestra documentos consultados
- Score de similitud
- Metadatos de la fuente

### Estado de conexión
- ✅ Conectado - Backend disponible
- 🟡 Conectando - Verificando conexión  
- ❌ Error - Backend no disponible

## Variables de entorno

- `NEXT_PUBLIC_API_URL` - URL del backend RAG (default: http://localhost:3000/api/v1)

## Stack tecnológico

- **Framework**: Next.js 15 con App Router
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Listo para Vercel

## Integración con Backend

La interfaz se conecta automáticamente con el backend RAG mediante:

- `GET /health` - Verificar estado de conexión
- `POST /chat` - Enviar mensajes y recibir respuestas con fuentes

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Linting
npm run lint

# Build para producción
npm run build
```

## Deployment

La aplicación está lista para desplegarse en cualquier plataforma que soporte Next.js:

- **Vercel** (recomendado)
- **Netlify** 
- **Docker**
- **Servidor Node.js**