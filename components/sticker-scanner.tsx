"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, X, Check, Trash2, Edit2, RotateCcw, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { analyzeStickers } from "@/lib/actions/analyze-stickers";
import { toast } from "sonner";

// Robot animation component (copied from smart-exchange.tsx)
function RobotAnimation({ message }: { message: string }) {
  const [dots, setDots] = useState(0);
  
  useState(() => {
    const interval = setInterval(() => {
      setDots(d => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  });
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl border-2 border-primary/50 flex items-center justify-center">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <div className="w-4 h-4 bg-accent rounded-full -mt-1 ml-[-5px] animate-pulse" />
          </div>
          <div className="flex gap-6">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse flex items-center justify-center">
              <div className="w-3 h-3 bg-background rounded-full" />
            </div>
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
              <div className="w-3 h-3 bg-background rounded-full" />
            </div>
          </div>
          <div className="absolute bottom-8 left-6 right-6 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
        </div>
        <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-accent animate-bounce" />
        <Zap className="absolute top-6 -left-6 w-5 h-5 text-accent animate-pulse" />
      </div>
      <div className="w-64 h-3 bg-secondary rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent animate-progress"
          style={{ width: '100%' }} 
        />
      </div>
      <p className="text-center text-foreground text-base max-w-sm">
        {message}{'.'.repeat(dots)}
      </p>
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

interface StickerScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (stickers: string[]) => void;
}

export function StickerScanner({ isOpen, onClose, onImport }: StickerScannerProps) {
  const [step, setStep] = useState<"camera" | "loading" | "results">("camera");
  const [results, setResults] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Compresión inteligente: Redimensionar a un máximo de 1000px manteniendo proporción
    const maxWidth = 1000;
    const maxHeight = 1000;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext("2d");
    if (!context) return;
    
    // Pre-procesamiento: Escala de grises y aumento de contraste/brillo para infalibilidad
    context.filter = "grayscale(100%) contrast(140%) brightness(110%)";
    context.drawImage(video, 0, 0, width, height);
    
    // Comprimir calidad a 0.7 para reducir peso sin perder legibilidad
    const base64Image = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
    
    stopCamera();
    setStep("loading");
    
    try {
      const stickers = await analyzeStickers(base64Image);
      setResults(stickers);
      setStep("results");
    } catch (err) {
      console.error(err);
      toast.error("Error al analizar la imagen.");
      setStep("camera");
    }
  };

  const handleEdit = (index: number, newValue: string) => {
    const newResults = [...results];
    newResults[index] = newValue.toUpperCase();
    setResults(newResults);
  };

  const handleDelete = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    onImport(results);
    toast.success(`${results.length} estampas agregadas correctamente.`);
    resetScanner();
  };

  const resetScanner = () => {
    setStep("camera");
    setResults([]);
    stopCamera();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetScanner();
      onClose();
    } else {
      startCamera();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Escanear Estampas con IA
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === "camera" && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full aspect-[3/4] bg-muted rounded-xl overflow-hidden border-2 border-border shadow-inner">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button onClick={startCamera} variant="secondary" className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Reintentar Cámara
                    </Button>
                  </div>
                )}
                {/* Overlay guides */}
                <div className="absolute inset-4 border-2 border-white/30 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
                  <p className="text-white/60 text-xs text-center px-4">
                    Coloca las estampas dentro del cuadro y asegúrate de que haya buena luz.
                  </p>
                </div>
              </div>
              <Button 
                onClick={capturePhoto} 
                disabled={!isCameraActive}
                className="w-full h-14 rounded-full gap-2 text-lg font-bold"
              >
                <Camera className="w-6 h-6" />
                Tomar Foto
              </Button>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === "loading" && (
            <RobotAnimation message="Analizando tu colección con inteligencia artificial" />
          )}

          {step === "results" && (
            <div className="space-y-4">
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <h3 className="text-sm font-semibold mb-1">Resultados Identificados</h3>
                <p className="text-xs text-muted-foreground">
                  Revisa los códigos antes de agregarlos a tu álbum.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {results.map((code, index) => (
                  <div key={index} className="flex items-center gap-1 group">
                    <div className="relative flex-1">
                      <Input
                        value={code}
                        onChange={(e) => handleEdit(index, e.target.value)}
                        className="font-mono text-center uppercase pr-8"
                      />
                      <Edit2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(index)}
                      className="h-10 w-10 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No se detectaron estampas. Intenta tomar una foto más clara.</p>
                  <Button onClick={() => setStep("camera")} variant="link" className="mt-2">
                    Volver a intentar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {step === "results" && (
          <DialogFooter className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setStep("camera")} className="flex-1">
              Reintentar
            </Button>
            <Button onClick={handleConfirm} disabled={results.length === 0} className="flex-1 gap-2">
              <Check className="w-4 h-4" />
              Importar Todas
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
