"use client";

import { Check, Plus, Minus } from "lucide-react";
import type { Sticker } from "@/lib/album-data";

interface StickerCardProps {
  sticker: Sticker;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  readOnly?: boolean;
}

export function StickerCard({
  sticker,
  quantity,
  onAdd,
  onRemove,
  readOnly = false,
}: StickerCardProps) {
  const isOwned = quantity > 0;
  const isDuplicate = quantity > 1;

  const getTypeLabel = () => {
    switch (sticker.type) {
      case "badge":
        return "Escudo";
      case "team_photo":
        return "Equipo";
      case "player":
        return sticker.position || "Jugador";
      case "special":
        return "Especial";
      case "coca_cola":
        return "Coca-Cola";
      default:
        return "";
    }
  };

  const getTypeColor = () => {
    switch (sticker.type) {
      case "badge":
        return "bg-amber-500/20 text-amber-400";
      case "team_photo":
        return "bg-blue-500/20 text-blue-400";
      case "special":
        return "bg-purple-500/20 text-purple-400";
      case "coca_cola":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div
      className={`relative rounded-lg border transition-all duration-200 ${
        isOwned
          ? "bg-primary/10 border-primary/30"
          : "bg-card border-border hover:border-muted-foreground/30"
      }`}
    >
      {/* Main content - tappable area to add sticker */}
      <button
        onClick={readOnly ? undefined : onAdd}
        disabled={readOnly}
        className={`w-full p-3 text-left ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {/* Number badge */}
        <div className="flex items-start justify-between mb-2">
          <span
            className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold ${
              isOwned
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {sticker.number}
          </span>
          {isOwned && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Name */}
        <p
          className={`text-sm font-medium line-clamp-2 mb-1 ${
            isOwned ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {sticker.name}
        </p>

        {/* Type label */}
        <span className={`inline-block px-2 py-0.5 rounded text-xs ${getTypeColor()}`}>
          {getTypeLabel()}
        </span>
      </button>

      {/* Quantity controls - only show when owned and not read-only */}
      {isOwned && (
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <span className={`text-xs ${isDuplicate ? "text-accent font-medium" : "text-muted-foreground"}`}>
            {isDuplicate ? `+${quantity - 1} repetidas` : "1 estampa"}
          </span>
          {!readOnly && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-1.5 rounded-md bg-muted hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Quitar una"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-medium text-foreground">
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                className="p-1.5 rounded-md bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Agregar una"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {readOnly && (
            <span className="text-sm font-medium text-foreground">
              x{quantity}
            </span>
          )}
        </div>
      )}

      {/* Duplicate badge */}
      {isDuplicate && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lg">
          {quantity}
        </div>
      )}
    </div>
  );
}
