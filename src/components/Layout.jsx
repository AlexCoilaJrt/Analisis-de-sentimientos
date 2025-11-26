import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Sentimiento AI
                        </h1>
                    </div>
                    <nav className="flex gap-4">
                        <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                            Inicio
                        </a>
                        <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                            Historial
                        </a>
                    </nav>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} Sentimiento AI. Análisis de emociones avanzado.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
