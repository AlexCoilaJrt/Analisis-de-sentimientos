import fs from 'fs';

const lexiconData = JSON.parse(fs.readFileSync('./src/data/lexicon.json', 'utf8'));
const patternsData = JSON.parse(fs.readFileSync('./src/data/patterns.json', 'utf8'));

const { words: LEXICON } = lexiconData;
const { patterns: PATTERNS, modifiers: MODIFIERS, negations: NEGATIONS } = patternsData;

const analyzeSentimentAdvanced = (text) => {
    if (!text) return null;

    const lowerText = text.toLowerCase();
    let score = 0;
    let detectedEmotions = {};
    let detectedPatterns = [];

    PATTERNS.forEach(patternDef => {
        const regex = new RegExp(patternDef.pattern, 'gi');
        let match;
        while ((match = regex.exec(lowerText)) !== null) {
            if (patternDef.type === 'phrase') {
                score += patternDef.score * 2;
                detectedPatterns.push({ phrase: match[0], emotion: patternDef.emotion });
                detectedEmotions[patternDef.emotion] = (detectedEmotions[patternDef.emotion] || 0) + 3;
            }
            else if (patternDef.type === 'direct_emotion' || patternDef.type === 'direct_state') {
                const emotionWord = match[2];
                if (LEXICON[emotionWord]) {
                    let patternScore = LEXICON[emotionWord].score;
                    let multiplier = 1;
                    if (match[1] && MODIFIERS[match[1].trim()]) multiplier = MODIFIERS[match[1].trim()];

                    score += patternScore * multiplier * 2;
                    LEXICON[emotionWord].emotions.forEach(emo => {
                        detectedEmotions[emo] = (detectedEmotions[emo] || 0) + 3;
                    });
                    detectedPatterns.push({ phrase: match[0], emotion: LEXICON[emotionWord].emotions[0] });
                }
            }
        }
    });

    const tokens = lowerText.match(/[a-záéíóúñü]+/g) || [];
    for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i];
        if (LEXICON[word]) {
            let wordData = LEXICON[word];
            let currentScore = wordData.score;
            let multiplier = 1;
            if (i > 0) {
                const prevWord = tokens[i - 1];
                if (NEGATIONS.includes(prevWord)) multiplier *= -1;
                if (MODIFIERS[prevWord]) multiplier *= MODIFIERS[prevWord];
            }
            score += currentScore * multiplier;
            if (multiplier > 0) {
                wordData.emotions.forEach(emo => {
                    detectedEmotions[emo] = (detectedEmotions[emo] || 0) + 1;
                });
            }
        }
    }

    const normalizedScore = Math.max(-100, Math.min(100, score * 5));
    let classification = 'Neutral';
    if (normalizedScore > 5) classification = 'Positivo';
    if (normalizedScore < -5) classification = 'Negativo';

    return {
        classification,
        score: Math.round(normalizedScore),
        emotions: detectedEmotions,
        patterns: detectedPatterns.map(p => p.phrase)
    };
};

const testCases = [
    "Estoy de bajón, no tengo ánimo para nada",
    "Estoy hasta las narices de esta situación",
    "¡Qué bien! Me alegro muchísimo por ti",
    "Estoy con los nervios de punta, tengo el corazón acelerado",
    "Me siento muy feliz hoy, estoy en las nubes"
];

console.log("=== PRUEBAS CON EXPRESIONES COMUNES ===\n");
testCases.forEach((text, i) => {
    console.log(`${i + 1}. "${text}"`);
    const result = analyzeSentimentAdvanced(text);
    console.log(`   → ${result.classification} (${result.score})`);
    console.log(`   → Patrones: ${result.patterns.join(', ') || 'ninguno'}`);
    console.log(`   → Emociones: ${Object.keys(result.emotions).join(', ')}\n`);
});
