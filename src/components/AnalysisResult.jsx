import React from 'react';
import { Smile, Frown, Meh, BarChart2, Thermometer } from 'lucide-react';
import { clsx } from 'clsx';

const AnalysisResult = ({ result }) => {
    if (!result) return null;

    const { classification, score, emotions, intensity, keywords, explanation } = result;

    const getSentimentIcon = () => {
        switch (classification) {
            case 'Positivo': return <Smile className="w-16 h-16 text-green-500" />;
            case 'Negativo': return <Frown className="w-16 h-16 text-red-500" />;
            default: return <Meh className="w-16 h-16 text-slate-400" />;
        }
    };

    const getScoreColor = () => {
        if (score > 10) return 'bg-green-500';
        if (score < -10) return 'bg-red-500';
        return 'bg-slate-400';
    };

    const getScoreTextColor = () => {
        if (score > 10) return 'text-green-600';
        if (score < -10) return 'text-red-600';
        return 'text-slate-600';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex flex-col items-center justify-center min-w-[150px]">
                        {getSentimentIcon()}
                        <span className={clsx("mt-4 text-2xl font-bold", getScoreTextColor())}>
                            {classification}
                        </span>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-slate-500">Puntuación de Sentimiento</span>
                                <span className={clsx("font-bold", getScoreTextColor())}>{score > 0 ? '+' : ''}{score}</span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 z-10"></div>
                                <div
                                    className={clsx("h-full transition-all duration-1000 ease-out rounded-full", getScoreColor())}
                                    style={{
                                        width: `${Math.abs(score)}%`,
                                        marginLeft: score < 0 ? 'auto' : '50%',
                                        marginRight: score > 0 ? 'auto' : '50%',
                                        transformOrigin: score < 0 ? 'right' : 'left'
                                    }}
                                />
                                {/* Simplified bar for now: just width from 0 to 100 mapped from -100 to 100? 
                    The prompt asked for -100 to +100. 
                    Let's visualize it as a bar from center.
                    If score is -50, it goes from 50% to 25% (leftwards).
                    If score is +50, it goes from 50% to 75% (rightwards).
                */}
                                <div
                                    className={clsx("absolute top-0 bottom-0 transition-all duration-1000 ease-out", getScoreColor())}
                                    style={{
                                        left: score < 0 ? `${50 + (score / 2)}%` : '50%',
                                        width: `${Math.abs(score) / 2}%`
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-slate-400">
                                <span>-100</span>
                                <span>0</span>
                                <span>+100</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                    <Thermometer size={18} />
                                    <span className="text-sm font-medium">Intensidad Emocional</span>
                                </div>
                                <div className="text-lg font-semibold text-slate-800">{intensity}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2 text-slate-500">
                                    <BarChart2 size={18} />
                                    <span className="text-sm font-medium">Emoción Principal</span>
                                </div>
                                <div className="text-lg font-semibold text-slate-800">
                                    {Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Ninguna'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
                    <p className="text-slate-600 italic">"{explanation}"</p>
                </div>
            </div>

            {/* Emotions Breakdown & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Desglose de Emociones</h3>
                    <div className="space-y-3">
                        {Object.entries(emotions).map(([emotion, percent]) => (
                            <div key={emotion}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-slate-700">{emotion}</span>
                                    <span className="font-medium text-slate-900">{percent}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {Object.keys(emotions).length === 0 && (
                            <p className="text-slate-400 text-sm">No se detectaron emociones específicas.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Palabras Clave</h3>
                    <div className="flex flex-wrap gap-2">
                        {keywords && keywords.length > 0 ? (
                            keywords.map((word, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100"
                                >
                                    {word}
                                </span>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">No se identificaron palabras clave específicas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
