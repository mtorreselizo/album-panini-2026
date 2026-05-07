"use client";

import { teams, type Section } from "@/lib/album-data";
import { StickerCard } from "./sticker-card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TeamSectionProps {
  section: Section;
  getQuantity: (number: string) => number;
  onAdd: (number: string) => void;
  onRemove: (number: string) => void;
  defaultExpanded?: boolean;
  readOnly?: boolean;
}

export function TeamSection({
  section,
  getQuantity,
  onAdd,
  onRemove,
  defaultExpanded = false,
  readOnly = false,
}: TeamSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const team = teams.find(t => t.id === section.id);
  const ownedCount = section.stickers.filter(s => getQuantity(s.number) > 0).length;
  const totalCount = section.stickers.length;
  const progress = Math.round((ownedCount / totalCount) * 100);
  const isComplete = ownedCount === totalCount;

  const getSectionIcon = () => {
    if (section.type === "intro") return "🏆";
    if (section.type === "coca_cola") return "🥤";
    return team?.flag || "⚽";
  };

  const getSectionSubtitle = () => {
    if (section.type === "intro") return "Estampas especiales";
    if (section.type === "coca_cola") return "Colección promocional";
    return team ? `Grupo ${team.group} • ${team.confederation}` : "";
  };

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Section header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getSectionIcon()}</span>
          <div className="text-left">
            <h2 className="font-semibold text-foreground">{section.name}</h2>
            <p className="text-xs text-muted-foreground">{getSectionSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          <div className="text-right">
            <div className={`text-sm font-medium ${isComplete ? "text-primary" : "text-foreground"}`}>
              {ownedCount}/{totalCount}
            </div>
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isComplete ? "bg-primary" : "bg-accent"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Stickers grid */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {section.stickers.map(sticker => (
              <StickerCard
                key={sticker.number}
                sticker={sticker}
                quantity={getQuantity(sticker.number)}
                onAdd={() => onAdd(sticker.number)}
                onRemove={() => onRemove(sticker.number)}
                readOnly={readOnly}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
