import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target } from 'lucide-react';

export default function ModelMetrics() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMetrics, setShowMetrics] = useState(false);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const response = await fetch('http://localhost:8000/metrics');
            if (response.ok) {
                const data = await response.json();
                setMetrics(data);
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;
    if (!metrics) return null;

    const emotions = ['Alegría', 'Tristeza', 'Ira', 'Miedo'];
    const colors = {
        'Alegría': 'bg-green-500',
        'Tristeza': 'bg-blue-500',
        'Ira': 'bg-red-500',
        'Miedo': 'bg-purple-500'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors w-full justify-between"
            >
                <div className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    <span className="font-semibold">Métricas del Modelo ML</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {(metrics.overall.accuracy * 100).toFixed(1)}% Accuracy
                </span>
            </button>

            {showMetrics && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2">
                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                <Target size={16} />
                                <span className="text-xs font-medium">Accuracy</span>
                            </div>
                            <div className="text-2xl font-bold text-indigo-900">
                                {(metrics.overall.accuracy * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                <TrendingUp size={16} />
                                <span className="text-xs font-medium">Muestras</span>
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                                {metrics.overall.test_samples}
                            </div>
                        </div>
                    </div>

                    {/* Per-class metrics */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700">Métricas por Emoción</h4>
                        {emotions.map((emotion) => {
                            const data = metrics.per_class[emotion];
                            return (
                                <div key={emotion} className="border border-slate-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-slate-700">{emotion}</span>
                                        <span className="text-xs text-slate-500">{data.support} muestras</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div>
                                            <div className="text-slate-500 mb-1">Precision</div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${colors[emotion]}`}
                                                        style={{ width: `${data.precision * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-medium">{(data.precision * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 mb-1">Recall</div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${colors[emotion]}`}
                                                        style={{ width: `${data.recall * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-medium">{(data.recall * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 mb-1">F1-Score</div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex-1 bg-slate-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${colors[emotion]}`}
                                                        style={{ width: `${data['f1-score'] * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-medium">{(data['f1-score'] * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Confusion Matrix */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Matriz de Confusión</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr>
                                        <th className="p-2"></th>
                                        {emotions.map(e => (
                                            <th key={e} className="p-2 text-center font-medium text-slate-600">{e}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {emotions.map((emotion, i) => (
                                        <tr key={emotion}>
                                            <td className="p-2 font-medium text-slate-700">{emotion}</td>
                                            {metrics.confusion_matrix[i].map((val, j) => (
                                                <td
                                                    key={j}
                                                    className={`p-2 text-center ${i === j
                                                        ? 'bg-green-100 text-green-900 font-bold'
                                                        : val > 0
                                                            ? 'bg-red-50 text-red-700'
                                                            : 'bg-slate-50 text-slate-400'
                                                        }`}
                                                >
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
