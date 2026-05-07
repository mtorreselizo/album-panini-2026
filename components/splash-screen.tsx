'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 5000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Conectando a la Central de FIFA...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 50));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);

    // Change status text at different progress points
    const statusMessages = [
      { at: 20, text: 'Cargado Base de Datos de Estampas...' },
      { at: 40, text: 'Inicializando Equipos...' },
      { at: 60, text: 'Cargando Datos de Jugadores...' },
      { at: 80, text: 'Preparando tu Colección...' },
      { at: 95, text: 'Casi Listos...' },
    ];

    const statusInterval = setInterval(() => {
      setProgress((current) => {
        const nextStatus = statusMessages.find(s => current >= s.at && current < s.at + 5);
        if (nextStatus) {
          setStatusText(nextStatus.text);
        }
        return current;
      });
    }, 100);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-between bg-background overflow-hidden">
      {/* Football Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(42, 42, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 42, 42, 0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      
      {/* Pitch Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(213, 239, 69, 0.05) 0%, transparent 70%)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      {/* Top Spacer */}
      <div className="h-16" />

      {/* Center Identity Section */}
      <section className="flex flex-col items-center justify-center px-6 z-10 w-full">
        {/* Brand Logo */}
        <div className="w-full max-w-[320px] sm:max-w-[400px] mb-8 transition-transform duration-500 hover:scale-105 px-4">
          <img
            alt="Coding Academy Logo"
            className="w-full h-auto rounded-lg"
            style={{ filter: 'drop-shadow(0 0 25px rgba(213, 239, 69, 0.3))' }}
            src="/images/coding-academy-logo.jpg"
          />
        </div>

        {/* Visual Loader */}
        <div className="w-64 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#d5ef45] uppercase tracking-[0.2em]">
              System Initializing
            </span>
            <span className="text-xs font-bold text-muted-foreground">2026_WC</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/30 p-[1px]">
            <div 
              className="h-full rounded-full relative transition-all duration-100 ease-linear"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(to right, #06c85d, #d5ef45)',
                boxShadow: '0 0 12px rgba(102, 255, 142, 0.4)',
              }}
            >
              {/* Dynamic scan line */}
              <div className="absolute inset-0 bg-white/20 w-1/4 h-full blur-sm" />
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-border/20">
              <svg 
                className="w-4 h-4 text-[#d5ef45] animate-pulse" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20m0 2a8 8 0 0 0 0 16 8 8 0 0 0 0-16" />
                <path d="M12 6l2 4-4 2 2 4-4-2-2 4 2-4-4-2 4-2-2-4 4 2z" fill="currentColor" opacity="0.5" />
              </svg>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {statusText}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full px-6 pb-12 flex flex-col items-center text-center z-10">
        <div className="max-w-[480px] space-y-4">
          <p className="text-muted-foreground leading-relaxed opacity-80">
            Hecho con amor por alumnos de{' '}
            <span className="text-[#d5ef45] font-bold">Coding Academy</span>. 
            Unete a nosotros si quieres programar aplicaciones increíbles como esta.
          </p>
          <a
            className="inline-flex items-center gap-2 group px-6 py-3 bg-secondary hover:bg-secondary/80 border border-border/30 rounded-lg transition-all duration-300 active:scale-95"
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            href="https://codingacademy.com.mx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg 
              className="w-5 h-5 text-[#d5ef45] group-hover:rotate-12 transition-transform" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-base font-semibold text-foreground tracking-wide">
              codingacademy.com.mx
            </span>
          </a>
        </div>

        {/* Version Tag */}
        <div className="mt-8 flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
          <span>V2.6.0</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span>FIFA_TRACKER_BUILD</span>
        </div>
      </footer>

      {/* Corner Decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l border-t border-[#d5ef45]/20 m-6 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r border-b border-[#d5ef45]/20 m-6 pointer-events-none" />

      {/* Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
    </main>
  );
}
