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
    body: string;
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

export interface ExtendedTabItem extends TabItem {
    collectionId?: string;
    requestId?: string;
}