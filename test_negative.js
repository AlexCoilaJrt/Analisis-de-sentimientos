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
    let alertTriggered = false;

    // 1. Pattern Matching
    PATTERNS.forEach(patternDef => {
        const regex = new RegExp(patternDef.pattern, 'gi');
        let match;
        while ((match = regex.exec(lowerText)) !== null) {
            if (patternDef.type === 'phrase') {
                score += patternDef.score * 2;
                detectedPatterns.push({ phrase: match[0], emotion: patternDef.emotion });
                detectedEmotions[patternDef.emotion] = (detectedEmotions[patternDef.emotion] || 0) + 3;
                if (patternDef.alert) alertTriggered = true;
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

    // 2. Lexicon Analysis
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

    return { score, emotions: detectedEmotions, patterns: detectedPatterns };
};

const text = "Me siento desolado y sin esperanza. Todo es gris y estoy hundido.";
const result = analyzeSentimentAdvanced(text);
console.log(JSON.stringify(result, null, 2));
