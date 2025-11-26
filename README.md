# Sentimiento AI 🎭

Sistema avanzado de análisis de emociones que combina procesamiento de lenguaje natural (NLP) y visión por computadora para detectar emociones en texto y rostros.

![Sentimiento AI Preview](https://raw.githubusercontent.com/AlexCoilaJrt/Analisis-de-sentimientos/main/public/preview.png)

## 🚀 Características

- **Análisis de Texto Híbrido**: Combina reglas lingüísticas, modelos de Deep Learning (CNN) y validación con Claude AI.
- **Detección Facial en Tiempo Real**: Identifica 8 emociones faciales usando la cámara web o imágenes subidas (vía Roboflow).
- **Métricas Detalladas**: Visualización de precisión, confianza y estadísticas del modelo.
- **Interfaz Moderna**: UI reactiva y amigable construida con React y Tailwind CSS.

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **Python** (v3.9 o superior)
- **Git**

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlexCoilaJrt/Analisis-de-sentimientos.git
cd Analisis-de-sentimientos
```

### 2. Configurar el Frontend (React)

```bash
# Instalar dependencias
npm install
```

### 3. Configurar el Backend (Python/ML)

```bash
# Navegar a la carpeta de ML
cd ml

# Crear entorno virtual (opcional pero recomendado)
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
# Si no tienes requirements.txt, instala las principales:
pip install fastapi uvicorn torch numpy pandas scikit-learn inference-sdk opencv-python-headless
```

> **Nota:** Si tienes problemas con `numpy`, asegúrate de usar una versión compatible con `inference-sdk` (numpy >= 2.0.0).

## ▶️ Ejecución

Para que la aplicación funcione completamente, necesitas correr **ambos** servidores (Frontend y Backend) simultáneamente en terminales separadas.

### Terminal 1: Backend (API de ML)

```bash
cd ml
python3 api.py
```
*El servidor iniciará en `http://localhost:8000`*

### Terminal 2: Frontend (Aplicación Web)

```bash
# En la raíz del proyecto
npm run dev
```
*La aplicación abrirá en `http://localhost:5173`*

## 🔑 Configuración de APIs

El proyecto utiliza las siguientes APIs:
- **Roboflow**: Para detección facial (Configurada por defecto).
- **Anthropic (Claude)**: Para validación avanzada de texto (Requiere tu propia API Key en la configuración de la app).

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
