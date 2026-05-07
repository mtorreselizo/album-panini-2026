"use client";

import { Trophy, Repeat, Search, Eye } from "lucide-react";
import type { AlbumStats, User, ViewingAlbum, CollectionState } from "@/lib/types";
import { AlbumSelector } from "./album-selector";
import { SmartExchangeButton } from "./smart-exchange";

interface HeaderProps {
  stats: AlbumStats;
  activeTab: "album" | "duplicates" | "missing";
  onTabChange: (tab: "album" | "duplicates" | "missing") => void;
  user: User | null;
  isSyncing: boolean;
  currentViewing: ViewingAlbum | null;
  onViewAlbum: (album: ViewingAlbum | null) => void;
  myCollection?: CollectionState;
  friendCollection?: CollectionState;
  onOpenSmartExchange?: () => void;
}

export function Header({ stats, activeTab, onTabChange, user, isSyncing, currentViewing, onViewAlbum, myCollection, friendCollection, onOpenSmartExchange }: HeaderProps) {
  const isViewingFriend = currentViewing !== null;
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="px-4 py-3">
        {/* Title and album selector */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-lg font-bold text-foreground">
                PANINI APP
              </h1>
              <p className="text-xs text-muted-foreground">
                Hecho por{" "}
                <a href="https://codingacademy.com.mx" target="_blank" className="text-[#00A341] hover:underline">
                  Coding Academy
                </a>
              </p>
            </div>
          </div>
          <AlbumSelector
            user={user}
            isSyncing={isSyncing}
            currentViewing={currentViewing}
            onViewAlbum={onViewAlbum}
          />
        </div>

        {/* Viewing friend banner */}
        {isViewingFriend && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/20 rounded-lg border border-accent/30">
              <Eye className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">
                Viendo album de <strong>{currentViewing.displayName}</strong>
              </span>
              <span className="text-xs text-muted-foreground ml-auto">Solo lectura</span>
            </div>
            {/* Smart Exchange Button */}
            {myCollection && friendCollection && onOpenSmartExchange && (
              <div className="flex justify-center">
                <SmartExchangeButton onClick={onOpenSmartExchange} />
              </div>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progreso</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{stats.progress}%</span>
            <span className="text-xs text-muted-foreground ml-2">
              ({stats.owned}/{stats.total})
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-card rounded-lg p-2 text-center border border-border">
            <div className="text-lg font-bold text-primary">{stats.owned}</div>
            <div className="text-xs text-muted-foreground">Tengo</div>
          </div>
          <div className="bg-card rounded-lg p-2 text-center border border-border">
            <div className="text-lg font-bold text-destructive">{stats.missing}</div>
            <div className="text-xs text-muted-foreground">Faltan</div>
          </div>
          <div className="bg-card rounded-lg p-2 text-center border border-border">
            <div className="text-lg font-bold text-accent">{stats.duplicates}</div>
            <div className="text-xs text-muted-foreground">Repetidas</div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          <button
            onClick={() => onTabChange("album")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "album"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Álbum
          </button>
          <button
            onClick={() => onTabChange("duplicates")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "duplicates"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Repeat className="w-4 h-4" />
            Repetidas
          </button>
          <button
            onClick={() => onTabChange("missing")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "missing"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Busco
          </button>
        </div>
      </div>
    </header>
  );
}
