// app/types.ts

export interface KeyValueItem {
  key: string;
  value: string;
}

export interface TabItem {
  id: string;
  name: string;
  method: string;
  url: string;
  params: KeyValueItem[];
  headers: KeyValueItem[];
  bodyJson: string;          // مطمئن شو این هست
  bodyRaw: string;           // مطمئن شو این هست
  bodyType: 'json' | 'raw';  // مطمئن شو این هست
  response: any;
  loading: boolean;
  validationError: string | null;
}

export interface SavedRequest extends Omit<TabItem, 'loading' | 'response' | 'validationError'> {}

export interface CollectionItem {
  id: string;
  name: string;
  requests: SavedRequest[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  method: string;
  url: string;
}

// این کدهای جدید رو از TabItem ارث‌بری می‌کنه
export interface ExtendedTabItem extends TabItem {
  collectionId?: string;
  requestId?: string;
}