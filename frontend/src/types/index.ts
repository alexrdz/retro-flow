export interface Session {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export interface Column {
  id: number;
  sessionId: string;
  name: string;
  position: number;
  color: string;
  createdAt: string;
}

export interface Card {
    id: number;
    sessionId: string;
    content: string;
    columnId: number;
    position: number;
    createdAt: string;
    createdBy?: string;
}

export interface ActionItem {
    id: number;
    sessionId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
}


export type CardFormData = {
  content: string;
};

export type ActionItemFormData = {
  title: string;
  description?: string;
  assignedTo?: string;
};

// api request types
export interface SessionData {
  session: Session;
  columns: Column[];
  cards: Card[];
  actionItems: ActionItem[];
}

export interface UserPreferences {
  username: string | null;
  showUsername: boolean;
}
