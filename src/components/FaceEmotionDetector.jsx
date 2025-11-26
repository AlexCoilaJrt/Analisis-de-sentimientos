import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Loader2, CameraOff } from 'lucide-react';

const EMOTION_COLORS = {
    happy: 'bg-green-500',
    content: 'bg-emerald-500',
    neutral: 'bg-gray-500',
    sad: 'bg-blue-500',
    fear: 'bg-purple-500',
    anger: 'bg-red-500',
    disgust: 'bg-orange-500',
    surprise: 'bg-yellow-500'
};

const EMOTION_LABELS_ES = {
    happy: 'Feliz',
    content: 'Contento',
    neutral: 'Neutral',
    sad: 'Triste',
    fear: 'Miedo',
    anger: 'Enfado',
    disgust: 'Disgusto',
    surprise: 'Sorpresa'
};

export default function FaceEmotionDetector() {
    const [mode, setMode] = useState('upload');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Start webcam
    const startWebcam = async () => {
        console.log('🎥 Starting webcam...');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });

            console.log('✓ Got media stream:', mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                // Wait for video to be ready
                videoRef.current.onloadedmetadata = async () => {
                    try {
                        await videoRef.current.play();
                        console.log('✓ Video playing');
                        setStream(mediaStream);
                        setError(null);
                    } catch (playErr) {
                        console.error('Play error:', playErr);
                        setError('Error al reproducir el video');
                    }
                };
            } else {
                console.error('videoRef.current is null');
            }
        } catch (err) {
            console.error('Webcam error:', err);
            setError(`No se pudo acceder a la cámara: ${err.message}`);
        }
    };

    // Stop webcam
    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setResult(null);
        }
    };

    // Capture and analyze from webcam
    const captureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            if (blob) {
                await analyzeImage(blob);
            }
        }, 'image/jpeg', 0.8);
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setImagePreview(url);
        analyzeImage(file);
    };

    // Analyze image
    const analyzeImage = async (imageBlob) => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', imageBlob, 'face.jpg');

            const response = await fetch('http://localhost:8000/analyze-face', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en el análisis');
            }

            const data = await response.json();
            setResult(data);

            if (data.num_faces === 0) {
                setError('No se detectó ningún rostro en la imagen');
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Detección de Emociones Faciales</h2>

            {/* Mode Selector */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => { setMode('upload'); stopWebcam(); setResult(null); setImagePreview(null); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${mode === 'upload'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    <Upload size={18} />
                    Subir Imagen
                </button>
                <button
                    onClick={() => { setMode('webcam'); setImagePreview(null); setResult(null); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${mode === 'webcam'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    <Camera size={18} />
                    Cámara Web
                </button>
            </div>

            {/* Upload Mode */}
            {mode === 'upload' && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-12 hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex flex-col items-center gap-3"
                    >
                        <Upload size={48} className="text-slate-400" />
                        <span className="text-slate-600 font-medium">Click para subir una imagen</span>
                        <span className="text-sm text-slate-500">JPG, PNG hasta 10MB</span>
                    </button>

                    {/* Image Preview for Upload */}
                    {imagePreview && (
                        <div className="mt-6">
                            <div className="relative bg-slate-100 rounded-lg overflow-hidden">
                                <img src={imagePreview} alt="Preview" className="w-full" />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <Loader2 size={48} className="text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Webcam Mode */}
            {mode === 'webcam' && (
                <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Result Overlay on Video */}
                        {result && result.predictions && result.predictions[0] && (
                            <div className="absolute top-4 left-4 right-4 animate-in fade-in">
                                <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-xl p-4 border-2 border-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${EMOTION_COLORS[result.predictions[0].emotion] || 'bg-gray-500'} animate-pulse`} />
                                            <span className="text-white font-bold text-2xl">
                                                {EMOTION_LABELS_ES[result.predictions[0].emotion] || result.predictions[0].emotion}
                                            </span>
                                        </div>
                                        <span className="text-white text-3xl font-bold">
                                            {Math.round(result.predictions[0].confidence * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Placeholder when no stream */}
                        {!stream && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                <p className="text-slate-400">Inicia la cámara para comenzar</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {!stream ? (
                            <button
                                onClick={startWebcam}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Camera size={20} />
                                Iniciar Cámara
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={captureAndAnalyze}
                                    disabled={isAnalyzing}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                                    {isAnalyzing ? 'Analizando...' : 'Analizar Emoción'}
                                </button>
                                <button
                                    onClick={stopWebcam}
                                    className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <CameraOff size={20} />
                                    Detener
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Results for Upload Mode */}
            {mode === 'upload' && result && result.predictions && result.predictions.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-slate-700">
                        Resultados ({result.num_faces} {result.num_faces === 1 ? 'rostro' : 'rostros'} detectado{result.num_faces !== 1 && 's'})
                    </h3>
                    {result.predictions.map((pred, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${EMOTION_COLORS[pred.emotion] || 'bg-gray-500'}`} />
                                    <span className="font-semibold text-lg text-slate-800">
                                        {EMOTION_LABELS_ES[pred.emotion] || pred.emotion}
                                    </span>
                                </div>
                                <span className="text-2xl font-bold text-indigo-600">
                                    {Math.round(pred.confidence * 100)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <X size={20} />
                    {error}
                </div>
            )}
        </div>
    );
}
