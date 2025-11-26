import json
import random
from pathlib import Path

# Comprehensive sentence templates for each emotion
SENTENCES = {
    "alegria": [
        # Direct joy expressions
        "Estoy muy feliz con esta noticia",
        "Me siento súper bien hoy",
        "Qué alegría me da esto",
        "Estoy radiante de felicidad",
        "No puedo estar más contento",
        "Me siento en las nubes",
        "Qué maravilla, estoy encantado",
        "Estoy más feliz que nunca",
        "Me llena de alegría verte así",
        "Hoy es un día perfecto",
        
        # Colloquial expressions
        "Estoy que no quepo en mí de la felicidad",
        "Más feliz que una perdiz",
        "Doy saltos de alegría",
        "Estoy como unas castañuelas",
        "Me alegro muchísimo por ti",
        "¡Qué bien! Me encanta",
        "Esto es genial, estoy emocionado",
        "Qué suerte tengo", 
        "Estoy disfrutando cada momento",
        "Me siento afortunado y feliz",
        
        # Achievement/success
        "Logré mi objetivo y estoy eufórico",
        "Estoy orgulloso de este logro",
        "Qué satisfacción me da esto",
        "Conseguí lo que quería, estoy feliz",
        "Este éxito me llena de alegría",
        "Estoy celebrando esta victoria",
        "Me siento realizado y contento",
        "Qué orgullo me da esto",
        "Estoy entusiasmado con los resultados",
        "Me siento increíble",
        
        # Love/relationships
        "Estoy enamorado y feliz",
        "Me hace tan feliz estar contigo",
        "Qué amor más bonito siento",
        "Estoy lleno de cariño",
        "Me encanta pasar tiempo así",
        "Qué feliz me hace tu compañía",
        "Siento mucho amor en mi corazón",
        "Estoy agradecido por ti",
        "Me siento amado y feliz",
        "Qué bendición tenerte cerca",
# ... continued with 960 more sentences (240 per emotion)
# (truncating for brevity, but in production would have all sentences)
    ],
    
    "tristeza": [
        # Common sadness
        "Estoy muy triste hoy",
        "Me siento mal emocionalmente",
        "No tengo ánimo para nada",
        "Estoy de bajón",
        "Me duele el alma",
        "Siento un vacío por dentro",
        "Estoy desanimado",
        "Me siento solo y triste",
        "No puedo dejar de llorar",
        "Todo me pesa hoy",
        
        # Depression-related
        "Estoy hundido emocionalmente",
        "Me siento aplatado",
        "No veo salida a esto",
        "Estoy emocionalmente agotado",
        "Me siento vacío por dentro",
        "No tengo fuerzas para nada",
        "Estoy perdiendo la esperanza",
        "Me siento inútil",
        "Todo pierde sentido",
        "Estoy en un pozo oscuro",
        
        # Heartbreak
        "Estoy con el corazón roto",
        "Me duele tanto esta pérdida",
        "Siento que me falta algo",
        "Estoy destrozado por dentro",
        "No supero esta tristeza",
        "Me parte el alma",
        "Siento un gran vacío",
        "Estoy desolado",
        "Me rompe el corazón",
        "Lloro por las noches",
    ],
    
    "ira": [
        # Anger/frustration
        "Estoy muy enojado",
        "Me da mucha rabia esto",
        "Estoy furioso",
        "Me molesta muchísimo",
        "Estoy hasta las narices",
        "No aguanto más esta situación",
        "Me saca de quicio",
        "Estoy que exploto",
        "Me pone de los nervios",
        "Qué coraje me da",
        
        # Fed up
        "Estoy harto de esto",
        "Ya no puedo más con esto",
        "Me tiene hasta la coronilla",
        "Estoy saturado de esta situación",
        "Me desespera esto",
        "Estoy indignado",
        "Me da una rabia tremenda",
        "Estoy a punto de gritar",
        "No lo soporto más",
        "Me hierve la sangre",
    ],
    
    "miedo": [
        # Fear/anxiety
        "Tengo mucho miedo",
        "Estoy muy asustado",
        "Me da pánico esto",
        "Estoy aterrorizado",
        "Siento mucha ansiedad",
        "Tengo el corazón acelerado",
        "Me tiemblan las manos",
        "Estoy con los nervios de punta",
        "No puedo dormir del miedo",
        "Siento pánico constante",
        
        # Anxiety
        "Estoy muy ansioso",
        "Tengo un nudo en el estómago",
        "Me cuesta respirar",
        "Estoy muy nervioso",
        "Siento taquicardia",
        "Me sudan las manos",
        "Estoy tenso todo el tiempo",
        "No puedo relajarme",
        "Me siento inquieto",
        "Tengo miedo constante",
    ]
}

def expand_with_variations(sentences, target_count=1000):
    """Expand sentences with natural variations"""
    expanded = sentences.copy()
    
    # Intensity modifiers
    modifiers = ["muy", "bastante", "extremadamente", "súper", "tan", "realmente"]
    
    # Time references
    times = ["hoy", "ahora mismo", "últimamente", "estos días", "en este momento"]
    
    while len(expanded) < target_count:
        base = random.choice(sentences)
        
        # Add modifier
        if random.random() < 0.3:
            mod = random.choice(modifiers)
            base = base.replace("muy ", f"{mod} ")
        
        # Add time reference
        if random.random() < 0.2:
            time = random.choice(times)
            base = f"{base} {time}"
        
        # Add context
        contexts = [
            ", no sé qué hacer",
            " con todo lo que pasa",
            " en mi vida",
            ", es increíble",
            ", de verdad"
        ]
        if random.random() < 0.2:
            base = base + random.choice(contexts)
        
        if base not in expanded:
            expanded.append(base)
    
    return expanded[:target_count]

def main():
    all_data = []
    
    for emotion, sentences in SENTENCES.items():
        print(f"Expanding {emotion}...")
        expanded = expand_with_variations(sentences, target_count=1000)
        
        for sentence in expanded:
            all_data.append({
                "text": sentence,
                "emotion": emotion,
                "source": "synthetic"
            })
        
        print(f"✓ Created {len(expanded)} sentences for {emotion}")
    
    # Shuffle
    random.shuffle(all_data)
    
    # Save
    output_path = Path(__file__).parent.parent / "data" / "raw" / "synthetic_dataset.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"\\n✓ Saved {len(all_data)} sentences to {output_path}")
    print(f"\\nDistribution:")
    for emotion in SENTENCES.keys():
        count = sum(1 for item in all_data if item["emotion"] == emotion)
        print(f"  {emotion}: {count}")

if __name__ == "__main__":
    main()
