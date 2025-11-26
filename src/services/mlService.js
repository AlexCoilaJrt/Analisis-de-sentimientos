// ML Model API Service
const ML_API_URL = 'http://localhost:8000';

export const analyzeWithML = async (text) => {
    try {
        const response = await fetch(`${ML_API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('ML API request failed');
        }

        const data = await response.json();

        // Map ML emotions to our format
        const emotionMap = {
            'alegria': 'alegría',
            'tristeza': 'tristeza',
            'ira': 'ira',
            'miedo': 'miedo'
        };

        // Convert probabilities to percentages
        const emotions = {};
        Object.entries(data.probabilities).forEach(([key, value]) => {
            emotions[emotionMap[key] || key] = Math.round(value * 100);
        });

        // Determine classification based on ML prediction
        const mainEmotion = emotionMap[data.emotion] || data.emotion;
        let classification = 'Neutral';

        if (mainEmotion === 'alegría') {
            classification = 'Positivo';
        } else if (mainEmotion === 'tristeza' || mainEmotion === 'miedo' || mainEmotion === 'ira') {
            classification = 'Negativo';
        }

        // Calculate score based on emotion type
        let score;
        if (mainEmotion === 'alegría') {
            score = Math.round(data.confidence * 100); // 0 to 100
        } else {
            score = -Math.round(data.confidence * 100); // -100 to 0
        }

        return {
            classification,
            score,
            emotions,
            intensity: data.confidence > 0.9 ? 'Alta' : data.confidence > 0.7 ? 'Media' : 'Baja',
            keywords: [text.substring(0, 50)],
            explanation: `Análisis ML: ${mainEmotion} detectado con ${Math.round(data.confidence * 100)}% de confianza.`,
            mlConfidence: data.confidence,
            source: 'ml'
        };
    } catch (error) {
        console.error('ML API Error:', error);
        throw error;
    }
};

export const checkMLHealth = async () => {
    try {
        const response = await fetch(`${ML_API_URL}/health`);
        const data = await response.json();
        return data.status === 'ok' && data.model_loaded;
    } catch {
        return false;
    }
};
