"use client";

import { sections, teams } from "@/lib/album-data";
import { TeamSection } from "./team-section";
import { TeamFilter } from "./team-filter";
import { useState, useMemo } from "react";

interface AlbumViewProps {
  getQuantity: (number: string) => number;
  onAdd: (number: string) => void;
  onRemove: (number: string) => void;
  readOnly?: boolean;
}

export function AlbumView({
  getQuantity,
  onAdd,
  onRemove,
  readOnly = false,
}: AlbumViewProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedConfederation, setSelectedConfederation] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    // If a specific team is selected, show only that team
    if (selectedTeam) {
      return sections.filter(s => s.id === selectedTeam);
    }

    // Filter by confederation and group
    return sections.filter(section => {
      // Always show intro and coca-cola if no specific team filter
      if (section.type === "intro" || section.type === "coca_cola") {
        return selectedConfederation === "all";
      }

      const team = teams.find(t => t.id === section.id);
      if (!team) return false;

      if (selectedConfederation !== "all" && team.confederation !== selectedConfederation) {
        return false;
      }

      if (selectedGroup && team.group !== selectedGroup) {
        return false;
      }

      return true;
    });
  }, [selectedTeam, selectedConfederation, selectedGroup]);

  return (
    <div className="pb-20">
      <TeamFilter
        selectedTeam={selectedTeam}
        selectedConfederation={selectedConfederation}
        selectedGroup={selectedGroup}
        onTeamSelect={setSelectedTeam}
        onConfederationSelect={setSelectedConfederation}
        onGroupSelect={setSelectedGroup}
      />

      <div className="divide-y divide-border">
        {filteredSections.map(section => (
          <TeamSection
            key={section.id}
            section={section}
            getQuantity={getQuantity}
            onAdd={onAdd}
            onRemove={onRemove}
            defaultExpanded={selectedTeam !== null || filteredSections.length <= 4}
            readOnly={readOnly}
          />
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <span className="text-4xl mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Sin resultados
          </h3>
          <p className="text-sm text-muted-foreground">
            No hay equipos con los filtros seleccionados
          </p>
        </div>
      )}
    </div>
  );
}
