import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import InputSection from './components/InputSection';
import AnalysisResult from './components/AnalysisResult';
import History from './components/History';
import Settings from './components/Settings';
import ModelMetrics from './components/ModelMetrics';
import FaceEmotionDetector from './components/FaceEmotionDetector';
import { analyzeSentimentAdvanced } from './utils/advancedAnalysis';
import { analyzeWithClaude } from './services/claudeService';
import { analyzeWithML, checkMLHealth } from './services/mlService';
import { AlertCircle, Sparkles, MessageSquare, Camera } from 'lucide-react';

function App() {
  // Tab State
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'face'

  // State
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Settings State
  const [apiKey, setApiKey] = useState('');
  const [useClaude, setUseClaude] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('sentiment_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    const savedUseClaude = localStorage.getItem('use_claude');
    if (savedUseClaude) {
      setUseClaude(JSON.parse(savedUseClaude));
    }
  }, []);

  // Save to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('sentiment_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (apiKey) localStorage.setItem('anthropic_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('use_claude', JSON.stringify(useClaude));
  }, [useClaude]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // LAYER 1: Always run Advanced Local Analysis first (Rules + Patterns + Lexicon)
      const localResult = analyzeSentimentAdvanced(text);

      let finalResult = localResult;
      let usedML = false;

      // LAYER 2: If confidence is low, use ML for better accuracy
      const CONFIDENCE_THRESHOLD = 0.75;

      if (localResult.confidence < CONFIDENCE_THRESHOLD) {
        try {
          console.log(`Low confidence (${(localResult.confidence * 100).toFixed(0)}%), trying ML...`);
          const mlResult = await analyzeWithML(text);

          // Use ML result if it has higher confidence
          if (mlResult.mlConfidence > localResult.confidence) {
            finalResult = {
              ...mlResult,
              explanation: `${mlResult.explanation} (Confianza local: ${(localResult.confidence * 100).toFixed(0)}%)`
            };
            usedML = true;
          }
        } catch (mlError) {
          console.error("ML API failed, using local result:", mlError);
          // Continue with local result
        }
      }

      // LAYER 3: If Claude API is enabled, use it for validation/explanation
      if (useClaude && apiKey) {
        try {
          const claudeResult = await analyzeWithClaude(text, apiKey, finalResult);
          finalResult = {
            ...finalResult,
            ...claudeResult,
            explanation: claudeResult.explanation,
            source: usedML ? 'ml+claude' : 'rules+claude'
          };
        } catch (claudeError) {
          console.error("Claude API failed:", claudeError);
          setError(`Claude API error. Usando ${usedML ? 'ML' : 'análisis local'}.`);
        }
      } else if (useClaude && !apiKey) {
        setError("Se requiere API Key para validación con Claude.");
      }

      setResult(finalResult);

      // Add to history
      const newHistoryItem = {
        ...finalResult,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        timestamp: new Date().toISOString()
      };

      setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));

    } catch (err) {
      setError('Ocurrió un error inesperado durante el análisis.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = (item) => {
    // When selecting history, we might want to show the full text if we stored it, 
    // but we only stored a snippet. 
    // Ideally we should store the full text in history if we want to restore it.
    // Let's update history to store full text but display snippet.
    // For now, let's just show the result of that history item without restoring text 
    // (or restore text if it was short enough).
    // Actually, let's just set the result to view it.
    setResult(item);
    // Optional: setText(item.fullText) if we had it.
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-2">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all flex-1 justify-center font-medium ${activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <MessageSquare size={20} />
            Análisis de Texto
          </button>
          <button
            onClick={() => setActiveTab('face')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all flex-1 justify-center font-medium ${activeTab === 'face'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Camera size={20} />
            Análisis Facial
          </button>
        </div>

        <ModelMetrics />

        <Settings
          apiKey={apiKey}
          setApiKey={setApiKey}
          useClaude={useClaude}
          setUseClaude={setUseClaude}
        />

        {/* TEXT ANALYSIS TAB */}
        {activeTab === 'text' && (
          <>
            <InputSection
              text={text}
              setText={setText}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <AnalysisResult result={result} />
              </div>
            )}

            {history.length > 0 && (
              <History history={history} onSelectItem={handleSelectHistory} />
            )}
          </>
        )}

        {/* FACE ANALYSIS TAB */}
        {activeTab === 'face' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <FaceEmotionDetector />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
