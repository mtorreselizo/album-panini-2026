"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Friend, CollectionState } from '@/lib/types';

const USER_ID_KEY = 'fifa-wc-2026-user-id';
const SYNC_DEBOUNCE_MS = 1000;

function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like O, 0, I, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Initialize or fetch user
  useEffect(() => {
    async function initUser() {
      setIsLoading(true);
      setError(null);
      
      try {
        const storedUserId = localStorage.getItem(USER_ID_KEY);
        
        if (storedUserId) {
          // Try to fetch existing user
          const { data, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', storedUserId)
            .single();
          
          if (data && !fetchError) {
            setUser(data as User);
            await fetchFriends(storedUserId);
            setIsLoading(false);
            return;
          }
        }
        
        // Create new user
        const shortCode = generateShortCode();
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            short_code: shortCode,
            display_name: null,
            collection: {},
          })
          .select()
          .single();
        
        if (createError) {
          // If short_code collision, retry with new code
          if (createError.code === '23505') {
            const retryCode = generateShortCode();
            const { data: retryUser, error: retryError } = await supabase
              .from('users')
              .insert({
                short_code: retryCode,
                display_name: null,
                collection: {},
              })
              .select()
              .single();
            
            if (retryError) throw retryError;
            if (retryUser) {
              localStorage.setItem(USER_ID_KEY, retryUser.id);
              setUser(retryUser as User);
            }
          } else {
            throw createError;
          }
        } else if (newUser) {
          localStorage.setItem(USER_ID_KEY, newUser.id);
          setUser(newUser as User);
        }
      } catch (err) {
        console.error('Error initializing user:', err);
        setError('Error al conectar con la base de datos');
      } finally {
        setIsLoading(false);
      }
    }

    initUser();
  }, []);

  // Fetch friends list
  const fetchFriends = useCallback(async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
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
        .eq('user_id', userId);
      
      if (fetchError) throw fetchError;
      setFriends((data || []) as Friend[]);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  }, [supabase]);

  // Sync collection to database with debounce
  const syncCollection = useCallback(async (collection: CollectionState) => {
    if (!user) return;

    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce the sync
    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            collection,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
        
        // Update local user state
        setUser(prev => prev ? { ...prev, collection, updated_at: new Date().toISOString() } : null);
      } catch (err) {
        console.error('Error syncing collection:', err);
        setError('Error al guardar la colección');
      } finally {
        setIsSyncing(false);
      }
    }, SYNC_DEBOUNCE_MS);
  }, [user, supabase]);

  // Update display name
  const updateDisplayName = useCallback(async (name: string) => {
    if (!user) return false;
    
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ display_name: name })
        .eq('id', user.id);

      if (updateError) throw updateError;
      setUser(prev => prev ? { ...prev, display_name: name } : null);
      return true;
    } catch (err) {
      console.error('Error updating display name:', err);
      return false;
    }
  }, [user, supabase]);

  // Add friend by short code
  const addFriendByCode = useCallback(async (code: string, friendName?: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Usuario no inicializado' };
    
    const normalizedCode = code.toUpperCase().trim();
    
    if (normalizedCode === user.short_code) {
      return { success: false, error: 'No puedes agregarte a ti mismo' };
    }
    
    try {
      // Find user by short code
      const { data: friendUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('short_code', normalizedCode)
        .single();

      if (findError || !friendUser) {
        return { success: false, error: 'Código no encontrado' };
      }

      // Check if already friends
      const existingFriend = friends.find(f => f.friend_id === friendUser.id);
      if (existingFriend) {
        return { success: false, error: 'Ya tienes este amigo agregado' };
      }

      // Add friend
      const { error: insertError } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendUser.id,
          friend_name: friendName || friendUser.display_name || `Album ${normalizedCode}`,
        });

      if (insertError) throw insertError;

      // Refresh friends list
      await fetchFriends(user.id);
      return { success: true };
    } catch (err) {
      console.error('Error adding friend:', err);
      return { success: false, error: 'Error al agregar amigo' };
    }
  }, [user, friends, supabase, fetchFriends]);

  // Remove friend
  const removeFriend = useCallback(async (friendId: string) => {
    if (!user) return false;
    
    try {
      const { error: deleteError } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      if (deleteError) throw deleteError;

      setFriends(prev => prev.filter(f => f.friend_id !== friendId));
      return true;
    } catch (err) {
      console.error('Error removing friend:', err);
      return false;
    }
  }, [user, supabase]);

  // Get friend's album
  const getFriendAlbum = useCallback(async (friendId: string): Promise<User | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', friendId)
        .single();

      if (fetchError) throw fetchError;
      return data as User;
    } catch (err) {
      console.error('Error fetching friend album:', err);
      return null;
    }
  }, [supabase]);

  // Refresh friends data
  const refreshFriends = useCallback(async () => {
    if (user) {
      await fetchFriends(user.id);
    }
  }, [user, fetchFriends]);

  return {
    user,
    friends,
    isLoading,
    isSyncing,
    error,
    syncCollection,
    updateDisplayName,
    addFriendByCode,
    removeFriend,
    getFriendAlbum,
    refreshFriends,
  };
}
