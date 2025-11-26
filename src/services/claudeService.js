export const analyzeWithClaude = async (text, apiKey, localResult = null) => {
    if (!apiKey) {
        throw new Error('API Key is required');
    }

    let prompt = `
    Analiza el siguiente texto para detectar sentimientos y emociones.
    Texto: "${text}"
  `;

    if (localResult) {
        prompt += `
    
    Un análisis preliminar local arrojó:
    - Clasificación: ${localResult.classification}
    - Emociones: ${JSON.stringify(localResult.emotions)}
    - Score: ${localResult.score}

    Por favor, valida este análisis. Si estás de acuerdo, profundiza en la explicación. Si no, corrige y explica por qué.
    `;
    }

    prompt += `
    Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura:
    {
      "classification": "Positivo" | "Negativo" | "Neutral",
      "score": número entre -100 y 100,
      "emotions": { "emoción": porcentaje },
      "intensity": "Baja" | "Media" | "Alta",
      "keywords": ["palabra1", "palabra2"],
      "explanation": "Explicación detallada y empática (máx 3 oraciones). Si detectas riesgo de salud mental, sé muy cuidadoso y empático."
    }
  `;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1024,
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error calling Claude API');
        }

        const data = await response.json();
        const content = data.content[0].text;

        try {
            return JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse Claude response:", content);
            throw new Error("Invalid response format from Claude");
        }

    } catch (error) {
        console.error("Claude API Error:", error);
        throw error;
    }
};
