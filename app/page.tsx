"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { AlbumView } from "@/components/album-view";
import { DuplicatesList } from "@/components/duplicates-list";
import { MissingList } from "@/components/missing-list";
import { SplashScreen } from "@/components/splash-screen";
import { ImportExportButtons } from "@/components/import-export-buttons";
import { SmartExchangeFullscreen } from "@/components/smart-exchange";
import { StickerScanner } from "@/components/sticker-scanner";
import { useCollection } from "@/hooks/use-collection";
import { createClient } from "@/lib/supabase/client";
import type { ViewingAlbum, User, CollectionState } from "@/lib/types";

type Tab = "album" | "duplicates" | "missing";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("album");
  const [currentViewing, setCurrentViewing] = useState<ViewingAlbum | null>(null);
  const [friendAlbumData, setFriendAlbumData] = useState<User | null>(null);
  const [isLoadingFriend, setIsLoadingFriend] = useState(false);
  const [myOwnCollection, setMyOwnCollection] = useState<CollectionState>({});
  const [showSmartExchange, setShowSmartExchange] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  const supabase = createClient();
  
  // Use collection hook - pass friend data if viewing friend's album
  const {
    collection,
    stats,
    getQuantity,
    addSticker,
    bulkAddStickers,
    removeSticker,
    duplicateStickers,
    missingStickers,
    exportCollection,
    importCollection,
    user,
    isSyncing,
    isReadOnly,
  } = useCollection({ viewingFriendAlbum: friendAlbumData });

  // Store my own collection when switching to view friend's album
  useEffect(() => {
    if (!friendAlbumData && collection && Object.keys(collection).length > 0) {
      setMyOwnCollection(collection);
    }
  }, [friendAlbumData, collection]);

  // Handle viewing album change
  const handleViewAlbum = async (album: ViewingAlbum | null) => {
    if (!album) {
      // Going back to own album
      setCurrentViewing(null);
      setFriendAlbumData(null);
      return;
    }

    // Loading friend's album
    setIsLoadingFriend(true);
    setCurrentViewing(album);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', album.userId)
        .single();
      
      if (!error && data) {
        setFriendAlbumData(data as User);
      }
    } catch (err) {
      console.error('Error loading friend album:', err);
    } finally {
      setIsLoadingFriend(false);
    }
  };

  // Refresh friend album data when viewing
  useEffect(() => {
    if (currentViewing && !isLoadingFriend) {
      // Refresh friend data periodically if viewing
      const interval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentViewing.userId)
            .single();
          
          if (!error && data) {
            setFriendAlbumData(data as User);
          }
        } catch (err) {
          console.error('Error refreshing friend album:', err);
        }
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentViewing, isLoadingFriend, supabase]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} duration={15000} />;
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        stats={stats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        isSyncing={isSyncing}
        currentViewing={currentViewing}
        onViewAlbum={handleViewAlbum}
        myCollection={currentViewing ? myOwnCollection : undefined}
        friendCollection={friendAlbumData?.collection}
        onOpenSmartExchange={() => setShowSmartExchange(true)}
        onOpenScanner={() => setShowScanner(true)}
      />

      {isLoadingFriend ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Cargando album...</p>
        </div>
      ) : (
        <>
          {activeTab === "album" && (
            <AlbumView
              getQuantity={getQuantity}
              onAdd={addSticker}
              onRemove={removeSticker}
              readOnly={isReadOnly}
            />
          )}

          {activeTab === "duplicates" && (
            <DuplicatesList
              duplicates={duplicateStickers}
              onAdd={addSticker}
              onRemove={removeSticker}
              readOnly={isReadOnly}
            />
          )}

          {activeTab === "missing" && (
            <MissingList
              missingNumbers={missingStickers}
              onAdd={addSticker}
              readOnly={isReadOnly}
            />
          )}
        </>
      )}

      {!isReadOnly && (
        <ImportExportButtons
          onExport={exportCollection}
          onImport={importCollection}
        />
      )}

      {/* Smart Exchange Fullscreen */}
      {currentViewing && friendAlbumData && (
        <SmartExchangeFullscreen
          myCollection={myOwnCollection}
          friendCollection={friendAlbumData.collection}
          friendName={currentViewing.displayName}
          isOpen={showSmartExchange}
          onClose={() => setShowSmartExchange(false)}
        />
      )}

      {/* Sticker Scanner */}
      <StickerScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onImport={(stickers) => {
          bulkAddStickers(stickers);
          setShowScanner(false);
        }}
      />
    </main>
  );
}
