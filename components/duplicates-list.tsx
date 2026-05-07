"use client";

import { useState, useRef, useEffect } from "react";
import { allStickers, teams, sections } from "@/lib/album-data";
import { Repeat, Minus, Plus, Share2, Filter, ChevronDown, X, Search } from "lucide-react";

interface DuplicatesListProps {
  duplicates: { number: string; extra: number }[];
  onAdd: (number: string) => void;
  onRemove: (number: string) => void;
  readOnly?: boolean;
}

export function DuplicatesList({ duplicates, onAdd, onRemove, readOnly = false }: DuplicatesListProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showTeamPicker && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!showTeamPicker) {
      setSearchQuery("");
    }
  }, [showTeamPicker]);
  if (duplicates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Repeat className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Sin estampas repetidas
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Cuando tengas estampas repetidas, aparecerán aquí para que puedas intercambiarlas.
        </p>
      </div>
    );
  }

  const getStickerInfo = (number: string) => {
    const sticker = allStickers.find(s => s.number === number);
    if (!sticker) return { name: number, team: null, section: null };
    
    const section = sections.find(s => s.stickers.some(st => st.number === number));
    const team = sticker.teamId ? teams.find(t => t.id === sticker.teamId) : null;
    
    return { name: sticker.name, team, section, sticker };
  };

  const totalDuplicates = duplicates.reduce((acc, d) => acc + d.extra, 0);

  // Get unique teams that have duplicates
  const teamsWithDuplicates = [...new Set(
    duplicates
      .map(d => getStickerInfo(d.number).team)
      .filter((t): t is NonNullable<typeof t> => t !== null)
  )].sort((a, b) => a.code.localeCompare(b.code));

  // Filter teams for dropdown search
  const filteredTeamsForPicker = teamsWithDuplicates.filter(team => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const teamName = team.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const teamCode = team.code.toLowerCase();
    return teamName.includes(query) || teamCode.includes(query);
  });

  // Filter duplicates by selected team
  const filteredDuplicates = selectedTeam
    ? duplicates.filter(d => {
        const info = getStickerInfo(d.number);
        return info.team?.id === selectedTeam;
      })
    : duplicates;

  const selectedTeamData = selectedTeam ? teams.find(t => t.id === selectedTeam) : null;

  const handleShare = async () => {
    // duplicates already comes sorted from the hook (FWC first, then teams by code)
    const text = duplicates
      .map(d => {
        const info = getStickerInfo(d.number);
        return `${d.number} - ${info.name} (x${d.extra})`;
      })
      .join('\n');
    
    const shareText = `🔄 Mis estampas repetidas FIFA WC 2026:\n\n${text}\n\n¡Escribeme para intercambiar!\n\nEstoy usando la APP de PANINI Coding Academy\nChecala aquí:\nhttps://v0-fifa-sticker-app-ca.vercel.app/\n\nHecho por alumnos de Coding Academy:\nhttps://codingacademy.com.mx`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Lista copiada al portapapeles');
    }
  };

  return (
    <div className="pb-20">
      {/* Summary header */}
      <div className="sticky top-[220px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              Estampas para intercambiar
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredDuplicates.length} diferentes • {filteredDuplicates.reduce((acc, d) => acc + d.extra, 0)} total
              {selectedTeam && ` (${duplicates.length} total)`}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        </div>

        {/* Team filter */}
        {teamsWithDuplicates.length > 0 && (
          <>
            <button
              onClick={() => setShowTeamPicker(!showTeamPicker)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {selectedTeamData ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{selectedTeamData.flag}</span>
                    <span className="font-medium text-foreground">{selectedTeamData.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Filtrar por equipo...</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedTeam && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTeam(null);
                    }}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showTeamPicker ? "rotate-180" : ""}`} />
              </div>
            </button>

            {showTeamPicker && (
              <div className="bg-card rounded-lg border border-border">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar equipo..."
                      className="w-full pl-9 pr-4 py-2 bg-muted rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-secondary rounded-full"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-56 overflow-y-auto">
                  {!searchQuery && (
                    <button
                      onClick={() => {
                        setSelectedTeam(null);
                        setShowTeamPicker(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border ${
                        !selectedTeam ? "bg-primary/10" : ""
                      }`}
                    >
                      <span className="text-xl">🌍</span>
                      <span className="font-medium text-foreground">Ver todos</span>
                    </button>
                  )}
                  {filteredTeamsForPicker.length === 0 ? (
                    <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                      No se encontraron equipos
                    </div>
                  ) : (
                    filteredTeamsForPicker.map(team => (
                      <button
                        key={team.id}
                        onClick={() => {
                          setSelectedTeam(team.id);
                          setShowTeamPicker(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 ${
                          selectedTeam === team.id ? "bg-primary/10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{team.flag}</span>
                          <span className="font-medium text-foreground">{team.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {duplicates.filter(d => getStickerInfo(d.number).team?.id === team.id).length} repites
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Duplicates list */}
      <div className="divide-y divide-border">
        {filteredDuplicates.map(({ number, extra }) => {
          const { name, team, sticker } = getStickerInfo(number);
          
          return (
            <div
              key={number}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {team && <span className="text-xl">{team.flag}</span>}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded">
                      {number}
                    </span>
                    <span className="font-medium text-foreground">{name}</span>
                  </div>
                  {team && (
                    <p className="text-xs text-muted-foreground">{team.name}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!readOnly && (
                  <button
                    onClick={() => onRemove(number)}
                    className="p-2 rounded-lg bg-muted hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
                <span className="w-8 text-center text-lg font-bold text-accent">
                  {extra}
                </span>
                {!readOnly && (
                  <button
                    onClick={() => onAdd(number)}
                    className="p-2 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
