"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { allStickers } from '@/lib/album-data';
import type { CollectionState, AlbumStats, User } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'fifa-wc-2026-collection';
const USER_ID_KEY = 'fifa-wc-2026-user-id';
const SYNC_DEBOUNCE_MS = 1000;

function generateShortCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Sort function: FWC first (ascending), then teams by country code (ascending)
function sortStickerNumbers(numbers: string[]): string[] {
  return [...numbers].sort((a, b) => {
    const aIsFWC = a.startsWith('FWC');
    const bIsFWC = b.startsWith('FWC');
    
    if (aIsFWC && !bIsFWC) return -1;
    if (!aIsFWC && bIsFWC) return 1;
    
    if (aIsFWC && bIsFWC) {
      const aNum = parseInt(a.replace('FWC', ''), 10);
      const bNum = parseInt(b.replace('FWC', ''), 10);
      return aNum - bNum;
    }
    
    const aMatch = a.match(/^([A-Z]+)(\d+)$/);
    const bMatch = b.match(/^([A-Z]+)(\d+)$/);
    
    if (aMatch && bMatch) {
      const aCode = aMatch[1];
      const bCode = bMatch[1];
      
      if (aCode !== bCode) {
        return aCode.localeCompare(bCode);
      }
      
      return parseInt(aMatch[2], 10) - parseInt(bMatch[2], 10);
    }
    
    return a.localeCompare(b);
  });
}

// Helper to get initial state from localStorage
function getInitialCollection(): CollectionState {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading collection from localStorage:', error);
  }
  return {};
}

interface UseCollectionOptions {
  viewingFriendAlbum?: User | null;
}

export function useCollection(options: UseCollectionOptions = {}) {
  const { viewingFriendAlbum } = options;
  const isReadOnly = !!viewingFriendAlbum;
  
  const [collection, setCollection] = useState<CollectionState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Initialize user and collection
  useEffect(() => {
    async function initUser() {
      // If viewing friend's album, use their collection
      if (viewingFriendAlbum) {
        setCollection(viewingFriendAlbum.collection || {});
        setIsLoaded(true);
        return;
      }

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
            // Use DB collection if available, otherwise use localStorage
            const dbCollection = data.collection || {};
            const localCollection = getInitialCollection();
            
            // Merge: if DB is empty but local has data, use local
            if (Object.keys(dbCollection).length === 0 && Object.keys(localCollection).length > 0) {
              setCollection(localCollection);
              // Sync local to DB
              await supabase
                .from('users')
                .update({ collection: localCollection, updated_at: new Date().toISOString() })
                .eq('id', storedUserId);
            } else {
              setCollection(dbCollection);
              // Update localStorage
              localStorage.setItem(STORAGE_KEY, JSON.stringify(dbCollection));
            }
            setIsLoaded(true);
            return;
          }
        }
        
        // Create new user
        let shortCode = generateShortCode();
        let retries = 0;
        let newUser = null;
        
        while (retries < 3) {
          const { data, error: createError } = await supabase
            .from('users')
            .insert({
              short_code: shortCode,
              display_name: null,
              collection: getInitialCollection(),
            })
            .select()
            .single();
          
          if (!createError && data) {
            newUser = data;
            break;
          }
          
          if (createError?.code === '23505') {
            shortCode = generateShortCode();
            retries++;
          } else {
            throw createError;
          }
        }
        
        if (newUser) {
          localStorage.setItem(USER_ID_KEY, newUser.id);
          setUser(newUser as User);
          setCollection(newUser.collection || {});
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        // Fallback to localStorage only
        const saved = getInitialCollection();
        setCollection(saved);
      } finally {
        setIsLoaded(true);
      }
    }

    initUser();
  }, [viewingFriendAlbum]);

  // Sync to database with debounce (only for own album)
  const syncToDatabase = useCallback(async (newCollection: CollectionState) => {
    if (!user || isReadOnly) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      try {
        await supabase
          .from('users')
          .update({
            collection: newCollection,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error syncing to database:', error);
      } finally {
        setIsSyncing(false);
      }
    }, SYNC_DEBOUNCE_MS);
  }, [user, isReadOnly, supabase]);

  // Save to localStorage and sync to DB whenever collection changes
  useEffect(() => {
    if (!isLoaded || isReadOnly) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
      syncToDatabase(collection);
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  }, [collection, isLoaded, isReadOnly, syncToDatabase]);

  const addSticker = useCallback((stickerNumber: string) => {
    if (isReadOnly) return;
    setCollection(prev => ({
      ...prev,
      [stickerNumber]: {
        stickerNumber,
        quantity: (prev[stickerNumber]?.quantity || 0) + 1,
      },
    }));
  }, [isReadOnly]);

  const removeSticker = useCallback((stickerNumber: string) => {
    if (isReadOnly) return;
    setCollection(prev => {
      const current = prev[stickerNumber];
      if (!current || current.quantity <= 0) return prev;
      
      const newQuantity = current.quantity - 1;
      if (newQuantity === 0) {
        const { [stickerNumber]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [stickerNumber]: {
          ...current,
          quantity: newQuantity,
        },
      };
    });
  }, [isReadOnly]);

  const getQuantity = useCallback((stickerNumber: string) => {
    return collection[stickerNumber]?.quantity || 0;
  }, [collection]);

  const isOwned = useCallback((stickerNumber: string) => {
    return (collection[stickerNumber]?.quantity || 0) > 0;
  }, [collection]);

  const stats: AlbumStats = useMemo(() => {
    const total = allStickers.length;
    const owned = Object.values(collection).filter(item => item.quantity > 0).length;
    const duplicates = Object.values(collection).reduce(
      (acc, item) => acc + Math.max(0, item.quantity - 1),
      0
    );
    
    return {
      total,
      owned,
      missing: total - owned,
      duplicates,
      progress: Math.round((owned / total) * 100),
    };
  }, [collection]);

  const duplicateStickers = useMemo(() => {
    const dupes = Object.entries(collection)
      .filter(([_, item]) => item.quantity > 1)
      .map(([number, item]) => ({
        number,
        extra: item.quantity - 1,
      }));
    
    const sortedNumbers = sortStickerNumbers(dupes.map(d => d.number));
    return sortedNumbers.map(num => dupes.find(d => d.number === num)!);
  }, [collection]);

  const missingStickers = useMemo(() => {
    const missing = allStickers
      .filter(s => !isOwned(s.number))
      .map(s => s.number);
    return sortStickerNumbers(missing);
  }, [isOwned]);

  const exportCollection = useCallback(() => {
    return JSON.stringify(collection, null, 2);
  }, [collection]);

  const importCollection = useCallback((jsonString: string): boolean => {
    if (isReadOnly) return false;
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null) {
        return false;
      }
      setCollection(parsed);
      return true;
    } catch {
      return false;
    }
  }, [isReadOnly]);

  return {
    collection,
    addSticker,
    removeSticker,
    getQuantity,
    isOwned,
    stats,
    duplicateStickers,
    missingStickers,
    exportCollection,
    importCollection,
    user,
    isSyncing,
    isReadOnly,
    isLoaded,
  };
}
