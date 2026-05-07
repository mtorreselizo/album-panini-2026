"use client";

import { useState, useRef, useEffect } from "react";
import { teams, confederations, groups } from "@/lib/album-data";
import { ChevronDown, X, Filter, Search } from "lucide-react";

interface TeamFilterProps {
  selectedTeam: string | null;
  selectedConfederation: string;
  selectedGroup: string | null;
  onTeamSelect: (teamId: string | null) => void;
  onConfederationSelect: (conf: string) => void;
  onGroupSelect: (group: string | null) => void;
}

export function TeamFilter({
  selectedTeam,
  selectedConfederation,
  selectedGroup,
  onTeamSelect,
  onConfederationSelect,
  onGroupSelect,
}: TeamFilterProps) {
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showTeamPicker && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!showTeamPicker) {
      setSearchQuery("");
    }
  }, [showTeamPicker]);

  const filteredTeams = teams.filter(team => {
    // Filter by confederation
    if (selectedConfederation !== "all" && team.confederation !== selectedConfederation) {
      return false;
    }
    // Filter by group
    if (selectedGroup && team.group !== selectedGroup) {
      return false;
    }
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const teamName = team.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const teamCode = team.code.toLowerCase();
      return teamName.includes(query) || teamCode.includes(query);
    }
    return true;
  });

  const selectedTeamData = selectedTeam ? teams.find(t => t.id === selectedTeam) : null;

  return (
    <div className="sticky top-[220px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="px-4 py-3 space-y-3">
        {/* Confederation filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {confederations.map(conf => (
            <button
              key={conf.id}
              onClick={() => {
                onConfederationSelect(conf.id);
                onTeamSelect(null);
                onGroupSelect(null);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedConfederation === conf.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {conf.name}
            </button>
          ))}
        </div>

        {/* Group filter - only show if a confederation is selected */}
        {selectedConfederation !== "all" && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => {
                onGroupSelect(null);
                onTeamSelect(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                !selectedGroup
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todos Grupos
            </button>
            {groups.map(group => {
              const hasTeamsInGroup = teams.some(
                t => t.group === group && 
                (selectedConfederation === "all" || t.confederation === selectedConfederation)
              );
              if (!hasTeamsInGroup) return null;
              return (
                <button
                  key={group}
                  onClick={() => {
                    onGroupSelect(group);
                    onTeamSelect(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedGroup === group
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Grupo {group}
                </button>
              );
            })}
          </div>
        )}

        {/* Team selector */}
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
              <span className="text-muted-foreground">Seleccionar equipo...</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedTeam && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTeamSelect(null);
                }}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showTeamPicker ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Team picker dropdown */}
        {showTeamPicker && (
          <div className="bg-card rounded-lg border border-border">
            {/* Search input */}
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
            
            {/* Team list */}
            <div className="max-h-56 overflow-y-auto">
              {!searchQuery && (
                <button
                  onClick={() => {
                    onTeamSelect(null);
                    setShowTeamPicker(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border ${
                    !selectedTeam ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="text-xl">🌍</span>
                  <span className="font-medium text-foreground">Ver todos los equipos</span>
                </button>
              )}
              {filteredTeams.length === 0 ? (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                  No se encontraron equipos
                </div>
              ) : (
                filteredTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => {
                      onTeamSelect(team.id);
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
                    <span className="text-xs text-muted-foreground">Grupo {team.group}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
