"use client";

import { useState } from "react";
import { Download, Upload, X, Check, AlertCircle } from "lucide-react";

interface ImportExportButtonsProps {
  onExport: () => string;
  onImport: (json: string) => boolean;
}

export function ImportExportButtons({ onExport, onImport }: ImportExportButtonsProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = async () => {
    const jsonData = onExport();
    
    // Try to use Web Share API first (for mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi Coleccion PANINI WC 2026",
          text: jsonData,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
        console.log("Share cancelled or failed, falling back to clipboard");
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(jsonData);
      alert("Coleccion copiada al portapapeles");
    } catch {
      // Last fallback: download as file
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "panini-collection-2026.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    setImportError(null);
    setImportSuccess(false);
    
    if (!importText.trim()) {
      setImportError("Por favor pega el JSON de tu coleccion");
      return;
    }

    const success = onImport(importText.trim());
    
    if (success) {
      setImportSuccess(true);
      setTimeout(() => {
        setShowImportModal(false);
        setImportText("");
        setImportSuccess(false);
      }, 1500);
    } else {
      setImportError("El JSON no es valido. Verifica el formato.");
    }
  };

  const closeModal = () => {
    setShowImportModal(false);
    setImportText("");
    setImportError(null);
    setImportSuccess(false);
  };

  return (
    <>
      {/* Buttons */}
      <div className="px-4 py-6 border-t border-border bg-card/50">
        <p className="text-sm text-muted-foreground text-center mb-4">
          Respalda o restaura tu coleccion
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            Exportar
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Importar
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Importar Coleccion</h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Pega el JSON de tu coleccion exportada:
              </p>
              <textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  setImportError(null);
                }}
                placeholder='{"MEX1": {"stickerNumber": "MEX1", "quantity": 2}, ...}'
                className="w-full h-40 p-3 bg-muted rounded-lg text-foreground text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Error message */}
              {importError && (
                <div className="flex items-center gap-2 mt-3 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {importError}
                </div>
              )}

              {/* Success message */}
              {importSuccess && (
                <div className="flex items-center gap-2 mt-3 text-primary text-sm">
                  <Check className="w-4 h-4" />
                  Coleccion importada exitosamente
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-4 py-3 border-t border-border">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={importSuccess}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
