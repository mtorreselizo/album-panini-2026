export interface CollectionItem {
  stickerNumber: string;
  quantity: number;
}

export interface CollectionState {
  [stickerNumber: string]: CollectionItem;
}

export interface AlbumStats {
  total: number;
  owned: number;
  missing: number;
  duplicates: number;
  progress: number;
}

export interface User {
  id: string;
  short_code: string;
  display_name: string | null;
  collection: CollectionState;
  created_at: string;
  updated_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  friend_name: string | null;
  created_at: string;
  // Joined data
  friend?: User;
}

export interface ViewingAlbum {
  type: 'self' | 'friend';
  userId: string;
  displayName: string;
  shortCode: string;
}
