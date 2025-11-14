export interface Session {
    id: string;
    name: string;
    createdAt: string;
}

export interface Card {
    id: number;
    sessionId: string;
    content: string;
    columnType: ColumnType;
    position: number;
    createdAt: string;
}

export type ColumnType = 'went_well' | 'improve' | 'actions';
export const ColumnType = {
  WENT_WELL: 'went_well' as ColumnType,
  IMPROVE: 'improve' as ColumnType,
  ACTIONS: 'actions' as ColumnType,
} as const;


export type CardFormData = {
  content: string;
};
