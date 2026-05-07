"use client";

import { useState, useEffect } from "react";
import { ChevronDown, User, Users, UserPlus, Share2, Trash2, RefreshCw, Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { User as UserType, Friend, ViewingAlbum } from "@/lib/types";

interface AlbumSelectorProps {
  user: UserType | null;
  isSyncing: boolean;
  onViewAlbum: (album: ViewingAlbum | null) => void;
  currentViewing: ViewingAlbum | null;
}

export function AlbumSelector({ user, isSyncing, onViewAlbum, currentViewing }: AlbumSelectorProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [friendName, setFriendName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const supabase = createClient();

  // Fetch friends on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user?.id]);

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend:friend_id (
            id,
            short_code,
            display_name,
            collection,
            updated_at
          )
        `)
        .eq('user_id', user.id);
      
      if (!error && data) {
        setFriends(data as Friend[]);
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  const handleCopyCode = async () => {
    if (!user) return;
    
    try {
      await navigator.clipboard.writeText(user.short_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };

  const handleAddFriend = async () => {
    if (!user || !friendCode.trim()) return;
    
    setIsAdding(true);
    setAddError(null);
    
    const normalizedCode = friendCode.toUpperCase().trim();
    
    if (normalizedCode === user.short_code) {
      setAddError('No puedes agregarte a ti mismo');
      setIsAdding(false);
      return;
    }
    
    try {
      // Find user by short code
      const { data: friendUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('short_code', normalizedCode)
        .single();

      if (findError || !friendUser) {
        setAddError('Codigo no encontrado');
        setIsAdding(false);
        return;
      }

      // Check if already friends
      const existingFriend = friends.find(f => f.friend_id === friendUser.id);
      if (existingFriend) {
        setAddError('Ya tienes este amigo agregado');
        setIsAdding(false);
        return;
      }

      // Add friend
      const { error: insertError } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendUser.id,
          friend_name: friendName.trim() || friendUser.display_name || `Album ${normalizedCode}`,
        });

      if (insertError) throw insertError;

      // Refresh friends list
      await fetchFriends();
      
      // Reset form and close
      setFriendCode("");
      setFriendName("");
      setIsAddFriendOpen(false);
    } catch (err) {
      console.error('Error adding friend:', err);
      setAddError('Error al agregar amigo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('friends')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      setFriends(prev => prev.filter(f => f.friend_id !== friendId));
      
      // If viewing this friend's album, go back to own
      if (currentViewing?.userId === friendId) {
        onViewAlbum(null);
      }
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const handleViewFriendAlbum = (friend: Friend) => {
    if (!friend.friend) return;
    
    onViewAlbum({
      type: 'friend',
      userId: friend.friend_id,
      displayName: friend.friend_name || friend.friend.display_name || `Album ${friend.friend.short_code}`,
      shortCode: friend.friend.short_code,
    });
  };

  const handleViewOwnAlbum = () => {
    onViewAlbum(null);
  };

  const currentLabel = currentViewing 
    ? currentViewing.displayName 
    : "Mi Album";

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Sync indicator */}
        <div className="flex items-center">
          {isSyncing ? (
            <Cloud className="w-4 h-4 text-primary animate-pulse" />
          ) : (
            <Cloud className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentViewing ? (
                <Users className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="max-w-[120px] truncate">{currentLabel}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Own album */}
            <DropdownMenuItem 
              onClick={handleViewOwnAlbum}
              className={!currentViewing ? "bg-accent" : ""}
            >
              <User className="w-4 h-4 mr-2" />
              Mi Album
              {user && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {user.short_code}
                </span>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Friends list */}
            {friends.length > 0 ? (
              <>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Albums de Amigos
                </div>
                {friends.map((friend) => (
                  <DropdownMenuItem
                    key={friend.id}
                    onClick={() => handleViewFriendAlbum(friend)}
                    className={currentViewing?.userId === friend.friend_id ? "bg-accent" : ""}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span className="flex-1 truncate">
                      {friend.friend_name || friend.friend?.display_name || `Album ${friend.friend?.short_code}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFriend(friend.friend_id);
                      }}
                      className="p-1 hover:bg-destructive/20 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            ) : (
              <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                No tienes amigos agregados
              </div>
            )}
            
            {/* Actions */}
            <DropdownMenuItem onClick={() => setIsAddFriendOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Amigo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir Mi Codigo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={fetchFriends}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar Lista
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Share Code Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tu Codigo de Album</DialogTitle>
            <DialogDescription>
              Comparte este codigo con tus amigos para que puedan ver tu album.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="text-4xl font-mono font-bold tracking-widest text-primary bg-primary/10 px-6 py-4 rounded-lg">
              {user?.short_code || "------"}
            </div>
            <Button onClick={handleCopyCode} variant="outline" className="gap-2">
              {copied ? "Copiado!" : "Copiar Codigo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Friend Dialog */}
      <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Amigo</DialogTitle>
            <DialogDescription>
              Ingresa el codigo de 6 caracteres de tu amigo para ver su album.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="friend-code">Codigo del Album</Label>
              <Input
                id="friend-code"
                placeholder="ABC123"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="font-mono text-lg tracking-widest text-center uppercase"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="friend-name">Nombre (opcional)</Label>
              <Input
                id="friend-name"
                placeholder="Nombre de tu amigo"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
              />
            </div>
            {addError && (
              <p className="text-sm text-destructive">{addError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddFriendOpen(false);
                setFriendCode("");
                setFriendName("");
                setAddError(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddFriend} 
              disabled={!friendCode.trim() || friendCode.length !== 6 || isAdding}
            >
              {isAdding ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
