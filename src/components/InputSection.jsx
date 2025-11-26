import React, { useEffect } from 'react';
import { Mic, MicOff, X, Play, Square } from 'lucide-react';
import useSpeechToText from '../hooks/useSpeechToText';
import { clsx } from 'clsx';

const InputSection = ({ text, setText, onAnalyze, isAnalyzing }) => {
    const { isListening, transcript, startListening, stopListening, resetTranscript, hasSupport } = useSpeechToText();

    useEffect(() => {
        if (transcript) {
            setText(prev => {
                // Avoid duplicating if transcript is appended multiple times in a way we don't want
                // But here we just append.
                // A better way might be to handle cursor position, but simple append is fine for now.
                // Actually, since transcript accumulates, we might want to only add the *new* part.
                // But our hook accumulates it.
                // Let's just set text to transcript if we want voice only, or append.
                // The user might type and then talk.
                // Let's assume the user uses voice to *add* text.
                // But the hook keeps the whole session transcript.
                // We should probably clear the hook transcript after adding it to text?
                // Or just let the hook manage its state and we sync it?
                // Let's try: when transcript changes, we append the difference? No that's hard.
                // Let's just make the voice input fill the text area.
                return prev + (prev && !prev.endsWith(' ') ? ' ' : '') + transcript.trim();
            });
            resetTranscript();
        }
    }, [transcript, setText, resetTranscript]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Entrada de Texto</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {text.length} caracteres
                </span>
            </div>

            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe algo o usa el micrófono para hablar..."
                    className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-slate-700 placeholder:text-slate-400 text-lg leading-relaxed"
                    disabled={isAnalyzing}
                />
                {text && (
                    <button
                        onClick={() => setText('')}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                        title="Limpiar texto"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
                <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!hasSupport || isAnalyzing}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
                        isListening
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 animate-pulse"
                            : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
                    )}
                >
                    {isListening ? (
                        <>
                            <MicOff size={18} />
                            <span>Detener Grabación</span>
                        </>
                    ) : (
                        <>
                            <Mic size={18} />
                            <span>Grabar Voz</span>
                        </>
                    )}
                </button>

                <button
                    onClick={onAnalyze}
                    disabled={!text.trim() || isAnalyzing}
                    className="flex-1 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-indigo-200 flex justify-center items-center gap-2"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Analizando...</span>
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            <span>Analizar Sentimientos</span>
                        </>
                    )}
                </button>
            </div>

            {!hasSupport && (
                <p className="text-xs text-amber-600 mt-2">
                    * Tu navegador no soporta reconocimiento de voz.
                </p>
            )}
        </div>
    );
};

export default InputSection;
