import anthropic
import json
import os
from pathlib import Path

# Configuration
API_KEY = os.getenv("ANTHROPIC_API_KEY", "")  # User will need to set this
EMOTIONS = {
    "alegria": 250,  # 250 per batch, 4 batches = 1000 total
    "tristeza": 250,
    "ira": 250,
    "miedo": 250
}

def generate_sentences_for_emotion(emotion, count, client):
    """Generate sentences for a specific emotion using Claude."""
    
    prompts = {
        "alegria": """Genera exactamente {count} oraciones cortas (10-30 palabras) en español expresando ALEGRÍA.
        Incluye variedad:
        - Frases cotidianas: "Qué bien, me alegro muchísimo"
        - Expresiones coloquiales: "Estoy en las nubes", "Más feliz que una perdiz"
        - Estados emocionales: "Me siento muy feliz", "Estoy radiante"
        - Contextos variados: trabajo, amor, logros, celebraciones
        
        Formato JSON: {{"sentences": ["oración 1", "oración 2", ...]}}""",
        
        "tristeza": """Genera exactamente {count} oraciones cortas (10-30 palabras) en español expresando TRISTEZA/DEPRESIÓN.
        Incluye variedad:
        - Frases comunes: "Estoy de bajón", "No tengo ánimo para nada"
        - Estados profundos: "Me siento vacío", "Estoy hundido"
        - Dolor emocional: "Me duele el alma", "Estoy con el corazón roto"
        - Contextos de salud mental (evita palabras extremas)
        
        Formato JSON: {{"sentences": ["oración 1", "oración 2", ...]}}""",
        
        "ira": """Genera exactamente {count} oraciones cortas (10-30 palabras) en español expresando IRA/ENOJO.
        Incluye variedad:
        - Expresiones comunes: "Estoy hasta las narices", "Me saca de quicio"
        - Frustración: "No aguanto más", "Estoy harto"
        - Molestia: "Me pone de los nervios", "Me da rabia"
        - Contextos variados: trabajo, relaciones, injusticias
        
        Formato JSON: {{"sentences": ["oración 1", "oración 2", ...]}}""",
        
        "miedo": """Genera exactamente {count} oraciones cortas (10-30 palabras) en español expresando MIEDO/ANSIEDAD.
        Incluye variedad:
        - Miedo directo: "Tengo miedo", "Estoy asustado"
        - Ansiedad: "Estoy con los nervios de punta", "Tengo un nudo en el estómago"
        - Pánico: "Siento pánico", "No puedo respirar"
        - Preocupación: "Estoy muy nervioso", "Me tiemblan las manos"
        
        Formato JSON: {{"sentences": ["oración 1", "oración 2", ...]}}"""
    }
    
    prompt = prompts[emotion].format(count=count)
    
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        response_text = message.content[0].text
        # Extract JSON from response
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        json_str = response_text[start_idx:end_idx]
        
        data = json.loads(json_str)
        return data.get("sentences", [])
    
    except Exception as e:
        print(f"Error generating sentences for {emotion}: {e}")
        return []

def main():
    if not API_KEY:
        print("ERROR: Set ANTHROPIC_API_KEY environment variable")
        print("Export it first: export ANTHROPIC_API_KEY='your-key-here'")
        return
    
    client = anthropic.Anthropic(api_key=API_KEY)
    
    all_data = []
    
    for emotion, count in EMOTIONS.items():
        print(f"\\nGenerating {count} sentences for {emotion}...")
        sentences = generate_sentences_for_emotion(emotion, count, client)
        
        if sentences:
            for sentence in sentences:
                all_data.append({
                    "text": sentence,
                    "emotion": emotion,
                    "source": "ai_generated"
                })
            print(f"✓ Generated {len(sentences)} sentences")
        else:
            print(f"✗ Failed to generate sentences for {emotion}")
    
    # Save to JSON
    output_path = Path(__file__).parent / "data" / "raw" / "ai_generated.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"\\n✓ Saved {len(all_data)} sentences to {output_path}")
    print(f"\\nDistribution:")
    for emotion in EMOTIONS:
        count = sum(1 for item in all_data if item["emotion"] == emotion)
        print(f"  {emotion}: {count}")

if __name__ == "__main__":
    main()
