"use client";

import { useState, useRef, useEffect } from "react";
import { allStickers, teams, sections } from "@/lib/album-data";
import { Search, Share2, Plus, Filter, ChevronDown, X } from "lucide-react";

interface MissingListProps {
  missingNumbers: string[];
  onAdd: (number: string) => void;
  readOnly?: boolean;
}

export function MissingList({ missingNumbers, onAdd, readOnly = false }: MissingListProps) {
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
  if (missingNumbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          ¡Álbum completo!
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Felicidades, tienes todas las estampas del álbum FIFA World Cup 2026.
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

  // Group missing stickers by team/section while maintaining order
  // missingNumbers already comes sorted from the hook (FWC first, then teams by code)
  const groupedMissing: { key: string; label: string; flag: string; code: string; numbers: string[] }[] = [];
  const groupMap = new Map<string, number>();

  missingNumbers.forEach(number => {
    const { team, section } = getStickerInfo(number);
    const key = team?.id || section?.id || 'other';
    const label = team?.name || section?.name || 'Otros';
    const flag = team?.flag || (section?.type === 'intro' ? '🏆' : '⚽');
    const code = team?.code || (section?.type === 'intro' ? '000' : 'ZZZ');
    
    if (!groupMap.has(key)) {
      groupMap.set(key, groupedMissing.length);
      groupedMissing.push({ key, label, flag, code, numbers: [] });
    }
    groupedMissing[groupMap.get(key)!].numbers.push(number);
  });

  // Sort groups: intro (FWC) first, then by country code
  groupedMissing.sort((a, b) => {
    if (a.code === '000') return -1;
    if (b.code === '000') return 1;
    return a.code.localeCompare(b.code);
  });

  // Get unique teams that have missing stickers
  const teamsWithMissing = [...new Set(
    missingNumbers
      .map(n => getStickerInfo(n).team)
      .filter((t): t is NonNullable<typeof t> => t !== null)
  )].sort((a, b) => a.code.localeCompare(b.code));

  // Filter teams for dropdown search
  const filteredTeamsForPicker = teamsWithMissing.filter(team => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const teamName = team.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const teamCode = team.code.toLowerCase();
    return teamName.includes(query) || teamCode.includes(query);
  });

  // Filter grouped missing by selected team
  const filteredGroupedMissing = selectedTeam
    ? groupedMissing.filter(g => g.key === selectedTeam)
    : groupedMissing;

  const filteredMissingCount = filteredGroupedMissing.reduce((acc, g) => acc + g.numbers.length, 0);
  const selectedTeamData = selectedTeam ? teams.find(t => t.id === selectedTeam) : null;

  const handleShare = async () => {
    const text = missingNumbers.map(n => {
      const info = getStickerInfo(n);
      return `${n} - ${info.name}`;
    }).join('\n');
    
    const shareText = `🔍 Estampas que busco FIFA WC 2026:\n\n${text}\n\n¡Escribeme si las tienes!\n\nEstoy usando la APP de PANINI Coding Academy\nChecala aquí:\nhttps://v0-fifa-sticker-app-ca.vercel.app/\n\nHecho por alumnos de Coding Academy:\nhttps://codingacademy.com.mx`;
    
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
              Estampas que me faltan
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredMissingCount} estampas pendientes
              {selectedTeam && ` (${missingNumbers.length} total)`}
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
        {teamsWithMissing.length > 0 && (
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
                          {groupedMissing.find(g => g.key === team.id)?.numbers.length || 0} faltan
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

      {/* Grouped missing list */}
      <div className="divide-y divide-border">
        {filteredGroupedMissing.map(({ key, label, flag, numbers }) => (
          <div key={key} className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{flag}</span>
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">
                ({numbers.length} faltan)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {numbers.map(number => (
                <button
                  key={number}
                  onClick={readOnly ? undefined : () => onAdd(number)}
                  disabled={readOnly}
                  className={`group flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm transition-colors ${
                    readOnly ? 'cursor-default' : 'hover:bg-primary/20'
                  }`}
                >
                  <span className={`font-medium ${readOnly ? 'text-muted-foreground' : 'text-muted-foreground group-hover:text-primary'}`}>
                    {number}
                  </span>
                  {!readOnly && (
                    <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
