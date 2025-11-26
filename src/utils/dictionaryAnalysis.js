export const POSITIVE_WORDS = {
    // Adjectives
    'feliz': 2, 'alegre': 2, 'contento': 2, 'genial': 3, 'excelente': 3,
    'bueno': 1, 'bien': 1, 'maravilloso': 3, 'fantástico': 3, 'increíble': 3,
    'hermoso': 2, 'bonito': 1, 'lindo': 1, 'agradecido': 2, 'mejor': 2,
    'perfecto': 3, 'super': 2, 'divertido': 2, 'tranquilo': 1, 'seguro': 1,
    'fuerte': 1, 'valiente': 2, 'inteligente': 2, 'sabio': 2, 'creativo': 2,
    'inspirado': 2, 'motivado': 2, 'apasionado': 3, 'entusiasta': 2,
    'optimista': 2, 'positivo': 2, 'afortunado': 2, 'bendecido': 3,
    'agradable': 1, 'orgulloso': 2, 'satisfecho': 2, 'radiante': 3,
    'luminoso': 2, 'brillante': 2, 'especial': 2, 'único': 2,

    // Nouns
    'amor': 3, 'felicidad': 3, 'alegría': 2, 'paz': 2, 'esperanza': 2,
    'fe': 2, 'confianza': 2, 'éxito': 2, 'triunfo': 2, 'placer': 2,
    'satisfacción': 2, 'risa': 2, 'sonrisa': 2, 'cariño': 2, 'abrazo': 2,
    'beso': 2, 'euforia': 3, 'gozo': 3, 'júbilo': 3, 'entusiasmo': 2,
    'pasión': 3, 'diversión': 2, 'celebración': 2, 'fiesta': 2,
    'belleza': 2, 'bondad': 2, 'gratitud': 2, 'armonía': 2,

    // Verbs (Infinitive & common conjugations)
    'amar': 3, 'amo': 3, 'ama': 3, 'aman': 3, 'amado': 3,
    'encantar': 3, 'encanta': 3, 'encantó': 3, 'encantado': 3,
    'ganar': 2, 'gané': 2, 'ganado': 2,
    'sonreír': 2, 'sonrío': 2, 'sonríe': 2, 'sonriendo': 2,
    'reír': 2, 'río': 2, 'ríe': 2, 'riendo': 2,
    'disfrutar': 2, 'disfruto': 2, 'disfruta': 2, 'disfrutando': 2,
    'celebrar': 2, 'celebro': 2, 'celebra': 2, 'celebrando': 2, 'celebrara': 2, 'celebrará': 2,
    'brillar': 2, 'brilla': 2, 'brillaba': 2, 'brillando': 2,
    'agradecer': 2, 'agradezco': 2, 'agradece': 2,
    'triunfar': 2, 'lograr': 2, 'conseguir': 1,
    'admirar': 2, 'apreciar': 2, 'valorar': 2
};

export const NEGATIVE_WORDS = {
    // Adjectives
    'triste': -2, 'mal': -1, 'malo': -1, 'peor': -2, 'horrible': -3,
    'terrible': -3, 'feo': -1, 'doloroso': -2, 'asustado': -2,
    'enojado': -2, 'molesto': -1, 'enfadado': -2, 'frustrado': -2,
    'decepcionado': -2, 'preocupado': -1, 'nervioso': -1, 'cansado': -1,
    'agotado': -2, 'aburrido': -1, 'solo': -1, 'vacío': -2, 'enfermo': -2,
    'injusto': -2, 'cruel': -3, 'negativo': -2, 'pesimista': -2,
    'deprimido': -3, 'desesperado': -3, 'ansioso': -2, 'estresado': -2,
    'furioso': -3, 'irritado': -2, 'indignado': -2, 'herido': -2,

    // Nouns
    'odio': -3, 'dolor': -2, 'sufrimiento': -3, 'miedo': -2, 'terror': -3,
    'pánico': -3, 'ira': -3, 'furia': -3, 'rabia': -3, 'fracaso': -3,
    'culpa': -2, 'vergüenza': -2, 'ansiedad': -2, 'estrés': -2,
    'soledad': -2, 'muerte': -3, 'enfermedad': -2, 'mentira': -2,
    'engaño': -3, 'traición': -3, 'violencia': -3, 'guerra': -3,
    'problema': -1, 'error': -1, 'defecto': -1, 'pena': -2,
    'lástima': -2, 'desgracia': -3, 'miseria': -3, 'angustia': -3,
    'asco': -3, 'repugnancia': -3,

    // Verbs
    'odiar': -3, 'odio': -3, 'odia': -3, 'odiado': -3,
    'detestar': -3, 'detesto': -3,
    'sufrir': -3, 'sufro': -3, 'sufre': -3, 'sufriendo': -3,
    'llorar': -2, 'lloro': -2, 'llora': -2, 'llorando': -2,
    'perder': -2, 'pierdo': -2, 'perdió': -2, 'perdido': -2,
    'morir': -3, 'muere': -3, 'muerto': -3,
    'matar': -3, 'mata': -3,
    'doler': -2, 'duele': -2,
    'molestar': -1, 'fastidiar': -1,
    'fallar': -2, 'fracasar': -2,
    'temer': -2, 'asustar': -2
};

export const MODIFIERS = {
    'muy': 1.5, 'mucho': 1.5, 'bastante': 1.3, 'tan': 1.3, 'sumamente': 1.8,
    'extremadamente': 2.0, 'realmente': 1.3, 'totalmente': 1.5, 'absolutamente': 1.5,
    'profunda': 1.5, 'profundo': 1.5, 'tremendo': 1.5, 'gran': 1.3, 'grande': 1.3,
    'poco': 0.5, 'algo': 0.7, 'apenas': 0.5, 'casi': 0.8, 'menos': 0.5, 'ligeramente': 0.8
};

export const NEGATIONS = ['no', 'nunca', 'jamás', 'tampoco', 'ni', 'sin', 'nadie', 'nada'];

export const analyzeSentimentOffline = (text) => {
    if (!text) return null;

    // Improved tokenization: split by non-word characters but keep accents
    const words = text.toLowerCase().match(/[a-záéíóúñü]+/g) || [];
    let score = 0;
    let wordScores = [];
    let detectedEmotions = {};

    // Expanded emotion mapping
    const emotionKeywords = {
        'felicidad': [
            'feliz', 'alegre', 'contento', 'risa', 'sonreír', 'divertido', 'placer',
            'felicidad', 'alegría', 'gozo', 'júbilo', 'euforia', 'celebrar', 'celebración',
            'disfrutar', 'encantar', 'maravilloso', 'genial', 'excelente', 'radiante'
        ],
        'tristeza': [
            'triste', 'llorar', 'dolor', 'sufrir', 'pena', 'lástima', 'deprimido',
            'soledad', 'solo', 'vacío', 'melancolía', 'desgracia', 'duelo', 'luto'
        ],
        'enojo': [
            'enojado', 'molesto', 'furioso', 'ira', 'rabia', 'odio', 'enfadado',
            'irritado', 'indignado', 'furia', 'detestar', 'fastidiar'
        ],
        'miedo': [
            'miedo', 'asustado', 'terror', 'pánico', 'temor', 'nervioso', 'ansiedad',
            'preocupado', 'horror', 'espanto', 'inquieto'
        ],
        'sorpresa': [
            'sorpresa', 'increíble', 'asombroso', 'inesperado', 'shock', 'sorprendido',
            'extraño', 'raro', 'milagro', 'súbito'
        ],
        'amor': [
            'amor', 'amar', 'querer', 'adorar', 'cariño', 'beso', 'abrazo',
            'pasión', 'enamorado', 'ternura', 'afecto'
        ]
    };

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let wordScore = 0;

        // Check previous word for negation or modifier
        let multiplier = 1;

        if (i > 0) {
            const prevWord = words[i - 1];
            if (NEGATIONS.includes(prevWord)) {
                multiplier *= -1;
            }
            if (MODIFIERS[prevWord]) {
                multiplier *= MODIFIERS[prevWord];
            }

            // Check two words back for "no muy" etc.
            if (i > 1) {
                const prevPrevWord = words[i - 2];
                if (NEGATIONS.includes(prevPrevWord) && MODIFIERS[prevWord]) {
                    // "no muy bueno" -> -1 * 1.5 * 1 = -1.5 (negative)
                    // Logic: negate the modifier effect?
                    // "no muy" -> usually means "not very", which is slightly negative or neutral.
                    // Current logic: multiplier = 1.5. If prevPrev is negation, multiplier becomes -1.5.
                    // "bueno" (1) * -1.5 = -1.5. Correct.
                    multiplier *= -1;
                }
            }
        }

        // Exact match check
        if (POSITIVE_WORDS[word]) {
            wordScore = POSITIVE_WORDS[word] * multiplier;
        } else if (NEGATIVE_WORDS[word]) {
            wordScore = NEGATIVE_WORDS[word] * multiplier;
        }
        // Simple suffix check for plurals (very basic stemming)
        else if (word.endsWith('s')) {
            const singular = word.slice(0, -1);
            if (POSITIVE_WORDS[singular]) wordScore = POSITIVE_WORDS[singular] * multiplier;
            else if (NEGATIVE_WORDS[singular]) wordScore = NEGATIVE_WORDS[singular] * multiplier;
        }

        if (wordScore !== 0) {
            score += wordScore;
            wordScores.push({ word, score: wordScore, index: i });
        }

        // Emotion detection
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            // Check exact match or if keyword is contained in word (e.g. "felicidad" in "felicidades")
            // Being careful not to match short words incorrectly.
            if (keywords.includes(word) || (word.length > 4 && keywords.some(k => k.length > 4 && word.includes(k)))) {
                detectedEmotions[emotion] = (detectedEmotions[emotion] || 0) + 1;
            }
        }
    }

    // Normalize score
    const normalizedScore = Math.max(-100, Math.min(100, score * 5));

    // Calculate emotion percentages
    const totalEmotions = Object.values(detectedEmotions).reduce((a, b) => a + b, 0);
    const emotionPercentages = {};
    if (totalEmotions > 0) {
        for (const [emotion, count] of Object.entries(detectedEmotions)) {
            emotionPercentages[emotion] = Math.round((count / totalEmotions) * 100);
        }
    }

    // Determine classification
    let classification = 'Neutral';
    if (normalizedScore > 5) classification = 'Positivo'; // Lower threshold
    if (normalizedScore < -5) classification = 'Negativo';

    return {
        classification,
        score: Math.round(normalizedScore),
        emotions: emotionPercentages,
        intensity: Math.abs(normalizedScore) > 70 ? 'Alta' : Math.abs(normalizedScore) > 30 ? 'Media' : 'Baja',
        keywords: wordScores.map(w => w.word),
        explanation: `Análisis basado en diccionario. Se detectaron ${wordScores.length} palabras clave.`
    };
};
