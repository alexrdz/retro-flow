export interface Session {
  id: string;
  name: string;
  createdAt: string;
}

export type ColumnType = 'went_well' | 'improve' | 'actions';

export interface Card {
  id: number;
  sessionId: string;
  content: string;
  columnType: ColumnType;
  position: number;
  createdAt: string;
}

export interface CreateSessionRequest {
  name?: string;
}

export interface CreateCardRequest {
  sessionId: string;
  content: string;
  columnType: ColumnType;
  position: number;
}

export interface UpdateCardRequest {
  content?: string;
  columnType?: ColumnType;
  position?: number;
}
