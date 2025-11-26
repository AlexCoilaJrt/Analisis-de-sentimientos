import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const History = ({ history, onSelect }) => {
    if (!history || history.length === 0) return null;

    return (
        <div className="mt-12">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
                <Clock size={20} />
                <h2 className="text-lg font-semibold">Historial Reciente</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(item)}
                        className="text-left bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={clsx(
                                "text-xs font-bold px-2 py-1 rounded-full",
                                item.classification === 'Positivo' ? "bg-green-100 text-green-700" :
                                    item.classification === 'Negativo' ? "bg-red-100 text-red-700" :
                                        "bg-slate-100 text-slate-700"
                            )}>
                                {item.classification}
                            </span>
                            <span className="text-xs text-slate-400">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                            {item.text}
                        </p>
                        <div className="flex items-center text-indigo-600 text-xs font-medium group-hover:translate-x-1 transition-transform">
                            Ver detalles <ArrowRight size={12} className="ml-1" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default History;
