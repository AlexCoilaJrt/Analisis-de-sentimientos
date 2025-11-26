import { analyzeSentimentOffline } from './src/utils/dictionaryAnalysis.js';

const text = "Hoy desperté con una sensación tan profunda de felicidad que parecía que todo a mi alrededor brillaba un poco más, como si el mundo entero celebrara conmigo.";
const result = analyzeSentimentOffline(text);

console.log(JSON.stringify(result, null, 2));
