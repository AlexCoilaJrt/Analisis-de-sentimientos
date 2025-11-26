import lexiconData from '../data/lexicon.json';
import patternsData from '../data/patterns.json';

const { words: LEXICON } = lexiconData;
const { patterns: PATTERNS, modifiers: MODIFIERS, negations: NEGATIONS } = patternsData;

export const analyzeSentimentAdvanced = (text) => {
    if (!text) return null;

    const lowerText = text.toLowerCase();
    let score = 0;
    let wordScores = [];
    let detectedEmotions = {};
    let detectedPatterns = [];
    let alertTriggered = false;

    // 1. Pattern Matching
    PATTERNS.forEach(patternDef => {
        const regex = new RegExp(patternDef.pattern, 'gi');
        let match;
        while ((match = regex.exec(lowerText)) !== null) {
            // If it's a direct phrase match with a score
            if (patternDef.type === 'phrase') {
                score += patternDef.score * 2; // Weight patterns higher
                detectedPatterns.push({
                    phrase: match[0],
                    emotion: patternDef.emotion,
                    score: patternDef.score
                });
                detectedEmotions[patternDef.emotion] = (detectedEmotions[patternDef.emotion] || 0) + 3; // Boost emotion count
                if (patternDef.alert) alertTriggered = true;
            }
            // If it's a "Me siento [emocion]" pattern
            else if (patternDef.type === 'direct_emotion' || patternDef.type === 'direct_state') {
                const intensityWord = match[1] ? match[1].trim() : null;
                const emotionWord = match[2];

                // Check if the emotion word exists in our lexicon
                if (LEXICON[emotionWord]) {
                    let patternScore = LEXICON[emotionWord].score;
                    let multiplier = 1;

                    if (intensityWord && MODIFIERS[intensityWord]) {
                        multiplier = MODIFIERS[intensityWord];
                    }

                    score += patternScore * multiplier * 2; // Boost

                    LEXICON[emotionWord].emotions.forEach(emo => {
                        detectedEmotions[emo] = (detectedEmotions[emo] || 0) + 3;
                    });

                    detectedPatterns.push({
                        phrase: match[0],
                        emotion: LEXICON[emotionWord].emotions[0],
                        score: patternScore * multiplier
                    });
                }
            }
        }
    });

    // 2. Lexicon Analysis
    // Tokenize but keep accents
    const tokens = lowerText.match(/[a-záéíóúñü]+/g) || [];

    for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i];

        // Skip if this word was part of a detected pattern (simplification: just check if it's in lexicon for now)
        // Ideally we'd mask out the patterns from the text first, but this is okay for a hybrid approach.

        if (LEXICON[word]) {
            let wordData = LEXICON[word];
            let currentScore = wordData.score;
            let multiplier = 1;

            // Check negation/modifiers
            if (i > 0) {
                const prevWord = tokens[i - 1];
                if (NEGATIONS.includes(prevWord)) {
                    multiplier *= -1;
                }
                if (MODIFIERS[prevWord]) {
                    multiplier *= MODIFIERS[prevWord];
                }
                // Check "no muy"
                if (i > 1) {
                    const prevPrevWord = tokens[i - 2];
                    if (NEGATIONS.includes(prevPrevWord) && MODIFIERS[prevWord]) {
                        multiplier *= -1;
                    }
                }
            }

            const finalWordScore = currentScore * multiplier;
            score += finalWordScore;

            wordScores.push({ word, score: finalWordScore, index: i });

            // Add emotions
            wordData.emotions.forEach(emo => {
                // If negated, maybe flip emotion? (e.g. not happy -> sad)
                // This is complex. For now, if negated, we reduce the count or ignore?
                // Let's just add it but maybe with less weight if negated?
                // Or better: "no feliz" -> score is negative, but emotion "alegría" might be confusing.
                // Simple approach: If multiplier is negative, don't add the original emotion.
                // Maybe add "disgusto" or generic negative?
                // For this demo, we'll only add emotions if multiplier is positive.
                if (multiplier > 0) {
                    detectedEmotions[emo] = (detectedEmotions[emo] || 0) + 1;
                }
            });
        }
    }

    // 3. Normalization & Formatting
    const normalizedScore = Math.max(-100, Math.min(100, score * 5));

    const totalEmotions = Object.values(detectedEmotions).reduce((a, b) => a + b, 0);
    const emotionPercentages = {};
    if (totalEmotions > 0) {
        for (const [emotion, count] of Object.entries(detectedEmotions)) {
            emotionPercentages[emotion] = Math.round((count / totalEmotions) * 100);
        }
    }

    let classification = 'Neutral';
    if (normalizedScore > 5) classification = 'Positivo';
    if (normalizedScore < -5) classification = 'Negativo';

    // Generate explanation
    let explanation = `Análisis avanzado: Se detectaron ${detectedPatterns.length} patrones y ${wordScores.length} palabras clave.`;
    if (alertTriggered) {
        explanation += " ⚠️ SE DETECTARON SEÑALES DE ALERTA.";
    }

    // Calculate confidence based on pattern matches and score strength
    let confidence = 0.5; // Base confidence

    // Boost confidence if we detected clear patterns
    if (detectedPatterns.length > 0) {
        confidence += 0.2;
    }

    // Boost confidence based on score magnitude
    const scoreMagnitude = Math.abs(normalizedScore) / 100;
    confidence += scoreMagnitude * 0.3;

    // Clip to 0-1
    confidence = Math.max(0, Math.min(1, confidence));

    return {
        classification,
        score: Math.round(normalizedScore),
        emotions: emotionPercentages,
        intensity: Math.abs(normalizedScore) > 70 ? 'Alta' : Math.abs(normalizedScore) > 30 ? 'Media' : 'Baja',
        keywords: [...detectedPatterns.map(p => p.phrase), ...wordScores.map(w => w.word)],
        explanation,
        isAlert: alertTriggered,
        confidence, // Add confidence for hybrid system
        source: 'rules' // Mark as rules-based
    };
};
