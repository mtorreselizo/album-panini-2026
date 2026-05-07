"use client";

import { useState, useEffect } from "react";
import { Bot, ArrowRightLeft, Sparkles, ArrowLeft, TrendingUp, TrendingDown, Zap, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CollectionState } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface SmartExchangeProps {
  myCollection: CollectionState;
  friendCollection: CollectionState;
  friendName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ExchangeSticker {
  number: string;
  priority: number;
  extraCount: number;
  rarity: number;
}

interface ExchangeResult {
  iGive: ExchangeSticker[];
  iReceive: ExchangeSticker[];
  totalExchanged: number;
  tradePowerLost: { me: number; friend: number };
}

import { sections, teams } from '@/lib/album-data';

// Create a static map of sticker number to team order for sorting
const stickerTeamOrderMap = new Map<string, number>();

// Initialize the map with order based on section index and team name
let orderIndex = 0;
for (const section of sections) {
  const teamName = section.name;
  for (const sticker of section.stickers) {
    stickerTeamOrderMap.set(sticker.number, orderIndex);
  }
  orderIndex++;
}

// Sort stickers by team (country) order
function sortStickersByTeam(stickers: ExchangeSticker[]): ExchangeSticker[] {
  return [...stickers].sort((a, b) => {
    const orderA = stickerTeamOrderMap.get(a.number) || 999;
    const orderB = stickerTeamOrderMap.get(b.number) || 999;
    if (orderA !== orderB) return orderA - orderB;
    // Within same team, sort by sticker number
    return a.number.localeCompare(b.number, undefined, { numeric: true });
  });
}

// Get duplicates (extra stickers beyond 1)
function getDuplicates(collection: CollectionState): Map<string, number> {
  const dupes = new Map<string, number>();
  for (const [number, item] of Object.entries(collection)) {
    if (item.quantity > 1) {
      dupes.set(number, item.quantity - 1);
    }
  }
  return dupes;
}

// Get missing stickers
function getMissing(collection: CollectionState, allStickerNumbers: string[]): Set<string> {
  const missing = new Set<string>();
  for (const number of allStickerNumbers) {
    if (!collection[number] || collection[number].quantity === 0) {
      missing.add(number);
    }
  }
  return missing;
}

// Calculate the smart exchange
async function calculateSmartExchange(
  myCollection: CollectionState,
  friendCollection: CollectionState,
  rarityData: Map<string, number>
): Promise<ExchangeResult> {
  const allNumbers = new Set<string>();
  Object.keys(myCollection).forEach(n => allNumbers.add(n));
  Object.keys(friendCollection).forEach(n => allNumbers.add(n));
  
  const { allStickers } = await import('@/lib/album-data');
  allStickers.forEach(s => allNumbers.add(s.number));
  
  const allStickerNumbers = Array.from(allNumbers);
  
  const myDuplicates = getDuplicates(myCollection);
  const friendDuplicates = getDuplicates(friendCollection);
  const myMissing = getMissing(myCollection, allStickerNumbers);
  const friendMissing = getMissing(friendCollection, allStickerNumbers);
  
  const canGive: ExchangeSticker[] = [];
  const canReceive: ExchangeSticker[] = [];
  
  for (const [number, extraCount] of myDuplicates) {
    if (friendMissing.has(number)) {
      const rarity = rarityData.get(number) || 50;
      const priority = (extraCount * 10) + (100 - rarity);
      canGive.push({ number, priority, extraCount, rarity });
    }
  }
  
  for (const [number, extraCount] of friendDuplicates) {
    if (myMissing.has(number)) {
      const rarity = rarityData.get(number) || 50;
      const priority = (extraCount * 10) + (100 - rarity);
      canReceive.push({ number, priority, extraCount, rarity });
    }
  }
  
  canGive.sort((a, b) => b.priority - a.priority);
  canReceive.sort((a, b) => b.priority - a.priority);
  
  const maxExchange = Math.min(canGive.length, canReceive.length);
  
  const iGive = canGive.slice(0, maxExchange);
  const iReceive = canReceive.slice(0, maxExchange);
  
  let myTradePowerBefore = 0;
  let friendTradePowerBefore = 0;
  
  for (const [, extraCount] of myDuplicates) {
    myTradePowerBefore += extraCount;
  }
  for (const [, extraCount] of friendDuplicates) {
    friendTradePowerBefore += extraCount;
  }
  
  const myTradePowerAfter = myTradePowerBefore - iGive.length;
  const friendTradePowerAfter = friendTradePowerBefore - iReceive.length;
  
  return {
    iGive,
    iReceive,
    totalExchanged: maxExchange,
    tradePowerLost: {
      me: myTradePowerBefore - myTradePowerAfter,
      friend: friendTradePowerBefore - friendTradePowerAfter,
    },
  };
}

// Robot animation component
function RobotAnimation({ message }: { message: string }) {
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      {/* Robot face */}
      <div className="relative mb-8">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
        
        {/* Robot head */}
        <div className="relative w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl border-2 border-primary/50 flex items-center justify-center">
          {/* Antenna */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <div className="w-4 h-4 bg-accent rounded-full -mt-1 ml-[-5px] animate-pulse" />
          </div>
          
          {/* Eyes */}
          <div className="flex gap-6">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse flex items-center justify-center">
              <div className="w-3 h-3 bg-background rounded-full" />
            </div>
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
              <div className="w-3 h-3 bg-background rounded-full" />
            </div>
          </div>
          
          {/* Mouth - scanning line */}
          <div className="absolute bottom-8 left-6 right-6 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
        </div>
        
        {/* Sparkles around */}
        <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-accent animate-bounce" />
        <Sparkles className="absolute -bottom-3 -left-3 w-5 h-5 text-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
        <Zap className="absolute top-6 -left-6 w-5 h-5 text-accent animate-pulse" />
      </div>
      
      {/* Loading bar */}
      <div className="w-64 h-3 bg-secondary rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ 
            width: '60%', 
            animation: 'loading 2s ease-in-out infinite' 
          }} 
        />
      </div>
      
      {/* Message */}
      <p className="text-center text-foreground text-base max-w-sm">
        {message}{'.'.repeat(dots)}
      </p>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}



// Exchange result display - Fullscreen version
function ExchangeResultView({ result, friendName, onClose }: { 
  result: ExchangeResult; 
  friendName: string;
  onClose: () => void;
}) {
  // Sort stickers by team (country) order
  const sortedIGive = sortStickersByTeam(result.iGive);
  const sortedIReceive = sortStickersByTeam(result.iReceive);

  const handleShare = async () => {
    const iGiveText = sortedIGive.map(s => s.extraCount > 1 ? `${s.number} (+${s.extraCount})` : s.number).join(', ');
    const iReceiveText = sortedIReceive.map(s => s.extraCount > 1 ? `${s.number} (+${s.extraCount})` : s.number).join(', ');
    
    const shareText = `Intercambio Inteligente con ${friendName}

Debo dar (${sortedIGive.length}):
${iGiveText}

Me debe dar ${friendName} (${sortedIReceive.length}):
${iReceiveText}

Esta lista fue calculada usando IA para tener el intercambio mas justo.`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Lista copiada al portapapeles');
    }
  };

  if (result.totalExchanged === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ArrowRightLeft className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">No hay intercambios posibles</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-8">
          No encontramos estampas que puedan intercambiar en este momento. 
          Intenta cuando alguno de los dos tenga nuevas repetidas.
        </p>
        <Button onClick={onClose} size="lg" className="px-8">Entendido</Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header stats */}
      <div className="flex-shrink-0 flex items-center justify-center gap-3 py-4 px-4 bg-accent/10 rounded-lg mx-4 mb-4">
        <Sparkles className="w-6 h-6 text-accent" />
        <span className="text-2xl font-bold text-foreground">{result.totalExchanged}</span>
        <span className="text-base text-muted-foreground">estampas a intercambiar</span>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {/* What I give */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-destructive" />
              <h4 className="font-semibold text-foreground">Debes dar:</h4>
              <Badge variant="outline" className="ml-auto">{result.iGive.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sortedIGive.map((sticker) => (
                <div 
                  key={sticker.number}
                  className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded text-xs border border-destructive/20"
                >
                  <span className="font-semibold text-foreground">{sticker.number}</span>
                  {sticker.extraCount > 1 && (
                    <span className="text-muted-foreground">(+{sticker.extraCount})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Exchange arrow */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          {/* What I receive */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Te debe dar {friendName}:</h4>
              <Badge variant="outline" className="ml-auto">{result.iReceive.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sortedIReceive.map((sticker) => (
                <div 
                  key={sticker.number}
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-xs border border-primary/20"
                >
                  <span className="font-semibold text-foreground">{sticker.number}</span>
                  {sticker.extraCount > 1 && (
                    <span className="text-muted-foreground">(+{sticker.extraCount})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Trade power info */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Este intercambio es justo: ambos intercambian {result.totalExchanged} estampas.
              <br />
              Las estampas se priorizaron por cantidad de repetidas para minimizar la perdida de poder de intercambio.
            </p>
          </div>
        </div>
      </div>
      
      {/* Fixed buttons at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-background space-y-2">
        <Button onClick={handleShare} variant="outline" size="lg" className="w-full gap-2">
          <Share2 className="w-4 h-4" />
          Compartir Intercambio
        </Button>
        <Button onClick={onClose} size="lg" className="w-full bg-primary hover:bg-primary/90">
          Entendido
        </Button>
      </div>
    </div>
  );
}

export function SmartExchangeButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Bot className="w-4 h-4" />
      Intercambio Inteligente
    </Button>
  );
}

export function SmartExchangeFullscreen({ myCollection, friendCollection, friendName, isOpen, onClose }: SmartExchangeProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ExchangeResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  
  // Fetch rarity data and start calculation when opened
  useEffect(() => {
    if (!isOpen) {
      // Reset states when closed
      setIsCalculating(false);
      setResult(null);
      setHasCalculated(false);
      return;
    }
    
    // Prevent re-running if already calculated
    if (hasCalculated || isCalculating) {
      return;
    }
    
    async function fetchAndCalculate() {
      setIsCalculating(true);
      
      try {
        const supabase = createClient();
        
        // Fetch rarity data
        const { data: users } = await supabase
          .from('users')
          .select('collection');
        
        const rarityMap = new Map<string, number>();
        
        if (users && users.length > 0) {
          const stickerCounts = new Map<string, number>();
          const totalUsers = users.length;
          
          for (const user of users) {
            const collection = user.collection as CollectionState;
            if (!collection) continue;
            
            for (const [number, item] of Object.entries(collection)) {
              if (item.quantity > 0) {
                stickerCounts.set(number, (stickerCounts.get(number) || 0) + 1);
              }
            }
          }
          
          for (const [number, count] of stickerCounts) {
            const ownershipRate = (count / totalUsers) * 100;
            rarityMap.set(number, Math.round(100 - ownershipRate));
          }
        }
        
        // Wait 10 seconds for animation
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Calculate exchange
        const exchangeResult = await calculateSmartExchange(
          myCollection,
          friendCollection,
          rarityMap
        );
        
        setResult(exchangeResult);
        setIsCalculating(false);
        setHasCalculated(true);
      } catch (error) {
        console.error('Error calculating exchange:', error);
        setIsCalculating(false);
        setHasCalculated(true);
      }
    }
    
    fetchAndCalculate();
  }, [isOpen, hasCalculated, isCalculating, myCollection, friendCollection]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Bot className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Intercambio Inteligente</h1>
      </div>
      
      {/* Content */}
      {isCalculating ? (
        <RobotAnimation 
          message="Utilizando IA para calcular el mejor intercambio posible entre ustedes" 
        />
      ) : result ? (
        <ExchangeResultView 
          result={result} 
          friendName={friendName} 
          onClose={onClose} 
        />
      ) : null}
    </div>
  );
}
