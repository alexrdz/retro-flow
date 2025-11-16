-- ============================================
  -- RetroFlow Schema Migration
  -- Version: 001
  -- Description: Migrate from hardcoded columns to dynamic columns + action items
  -- Date: 2025-11-15
  -- ============================================

  -- Drop existing tables (starting fresh)
  DROP TABLE IF EXISTS cards;
  DROP TABLE IF EXISTS sessions;

  -- ============================================
  -- SESSIONS TABLE (unchanged structure)
  -- ============================================
  CREATE TABLE sessions (
    id TEXT PRIMARY KEY,              -- nanoid generated in backend
    name TEXT NOT NULL,                -- session name
    created_at TEXT NOT NULL           -- ISO timestamp
  );

  -- ============================================
  -- COLUMNS TABLE (NEW - dynamic columns per session)
  -- ============================================
  CREATE TABLE columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- auto-generated ID
    session_id TEXT NOT NULL,              -- which session this column belongs to
    name TEXT NOT NULL,                    -- "What Went Well", "Needs Improvement", etc.
    position INTEGER NOT NULL,             -- order of columns (1, 2, 3...)
    color TEXT NOT NULL,                   -- hex color for UI styling
    created_at TEXT NOT NULL,              -- ISO timestamp

    -- Relationships
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );

  -- ============================================
  -- CARDS TABLE (MODIFIED - now references column_id)
  -- ============================================
  CREATE TABLE cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- auto-generated ID
    session_id TEXT NOT NULL,              -- which session this card belongs to
    column_id INTEGER NOT NULL,            -- which column this card belongs to (NEW!)
    content TEXT NOT NULL,                 -- card text content
    position INTEGER NOT NULL,             -- order within the column
    created_at TEXT NOT NULL,              -- ISO timestamp

    -- Relationships
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
  );

  -- ============================================
  -- ACTION ITEMS TABLE (NEW - separate from cards)
  -- ============================================
  CREATE TABLE action_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- auto-generated ID
    session_id TEXT NOT NULL,              -- which session this action item belongs to
    title TEXT NOT NULL,                   -- action item title
    description TEXT,                      -- optional detailed description
    assigned_to TEXT,                      -- optional assignee name
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    created_at TEXT NOT NULL,              -- ISO timestamp

    -- Relationships
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,

    -- Constraints
    CHECK (status IN ('pending', 'in_progress', 'completed'))
  );

  -- ============================================
  -- INDEXES (for query performance)
  -- ============================================

  -- Find all columns for a session (used often)
  CREATE INDEX idx_columns_session_id ON columns(session_id);

  -- Find all cards for a session (used often)
  CREATE INDEX idx_cards_session_id ON cards(session_id);

  -- Find all cards for a specific column (used often)
  CREATE INDEX idx_cards_column_id ON cards(column_id);

  -- Find all action items for a session (used often)
  CREATE INDEX idx_action_items_session_id ON action_items(session_id);

  -- Query action items by status (useful for filtering)
  CREATE INDEX idx_action_items_status ON action_items(status);
