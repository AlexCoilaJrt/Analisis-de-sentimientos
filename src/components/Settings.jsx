import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { clsx } from 'clsx';

const Settings = ({ apiKey, setApiKey, useClaude, setUseClaude }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey || '');

    const handleSave = () => {
        setApiKey(tempKey);
        setIsOpen(false);
    };

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <SettingsIcon size={16} />
                <span>Configuración</span>
            </button>

            {isOpen && (
                <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                    <h3 className="font-semibold text-slate-800 mb-4">Configuración de Análisis</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Validación con IA</span>
                                <span className="text-xs text-slate-500">
                                    {useClaude ? 'Activado: Claude validará el análisis local' : 'Desactivado: Solo análisis local rápido'}
                                </span>
                            </div>
                            <button
                                onClick={() => setUseClaude(!useClaude)}
                                className={clsx(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                    useClaude ? "bg-indigo-600" : "bg-slate-200"
                                )}
                            >
                                <span
                                    className={clsx(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        useClaude ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>

                        {useClaude && (
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    API Key de Anthropic (Claude)
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key size={16} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={tempKey}
                                            onChange={(e) => setTempKey(e.target.value)}
                                            placeholder="sk-ant-..."
                                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        Guardar
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Tu API Key se guarda localmente en tu navegador y nunca se comparte.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
