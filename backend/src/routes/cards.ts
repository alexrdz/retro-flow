import express from 'express';
const router = express.Router();
import { turso } from '../database';
import { Card, CreateCardRequest, UpdateCardRequest } from '../types';
import { sanitizeString, validateNumber, validateRequiredString, ValidationError } from '../utils/validation';

// POST /api/cards
router.post('/', async (req: express.Request, res: express.Response) => {
  // curl -X POST http://localhost:3001/api/cards -H 'Content-Type: application/json' -d '{"content": "test"}'
    try {
    const { sessionId, content, columnId, position, createdBy }: CreateCardRequest = req.body;

    const errors: ValidationError[] = [];

    const sessionIdError = validateRequiredString(sessionId, 'sessionId', 100);
    if (sessionIdError) errors.push(sessionIdError);

    const contentError = validateRequiredString(content, 'content', 500);
    if (contentError) errors.push(contentError);

    const columnIdError = validateNumber(columnId, 'columnId', 1);
    if (columnIdError) errors.push(columnIdError);

    const positionError = validateNumber(position, 'position', 0);
    if (positionError) errors.push(positionError);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    const sanitizedContent = sanitizeString(content, 500);

    const maxPositionResult = await turso.execute({
      sql: `SELECT MAX(position) as max_position FROM cards WHERE session_id = ? AND column_id = ?`,
      args: [sessionId, columnId]
    });

    const maxPosition = maxPositionResult.rows[0]?.max_position || 0;
    const newPosition = Number(maxPosition) + 1;

    const timestamp = new Date().toISOString();
    const result = await turso.execute(
      'INSERT INTO cards (session_id, content, column_id, position, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [sessionId, content, columnId, newPosition, createdBy || null, timestamp]
    );

    const newCardId = Number(result.lastInsertRowid);
    const newCard: Card = {
      id: newCardId,
      sessionId,
      content,
      columnId,
      position: newPosition,
      createdBy: createdBy || undefined,
      createdAt: timestamp
    };

    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// PUT /api/cards/:id
router.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id, username } = req.params;
    const { content, columnId, position }: UpdateCardRequest = req.body;

    const idError = validateNumber(id, 'id', 1);
    if (idError) {
      return res.status(400).json({ error: idError.message });
    }

    const errors: ValidationError[] = [];
    if (content !== undefined) {
      const contentError = validateRequiredString(content, 'content', 500);
      if (contentError) errors.push(contentError);
    }

    if (columnId !== undefined) {
      const columnIdError = validateNumber(columnId, 'columnId', 1);
      if (columnIdError) errors.push(columnIdError);
    }

    if (position !== undefined) {
      const positionError = validateNumber(position, 'position', 0);
      if (positionError) errors.push(positionError);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    const setClauses: string[] = [];
    const args: (string | number)[] = [];

    if (content !== undefined) {
      setClauses.push('content = ?');
      args.push(content);
    }
    if (columnId !== undefined) {
      setClauses.push('column_id = ?');
      args.push(columnId);
    }
    if (position !== undefined) {
      setClauses.push('position = ?');
      args.push(position);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    args.push(id, username);

    const result = await turso.execute(
      `UPDATE cards SET ${setClauses.join(', ')} WHERE id = ? AND created_by = ?`,
      args
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ message: `Updated card ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// DELETE /api/cards/:id
router.delete('/:id/:username', async (req: express.Request, res: express.Response) => {
  try {
    const { id, username } = req.params;
    const result = await turso.execute("DELETE FROM cards WHERE id = ? AND created_by = ?", [id, username]);
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ message: `Deleted card ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// GET /api/cards
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const sessionId = req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const data = await turso.execute("SELECT * FROM cards WHERE session_id = ?", [String(sessionId)]);
    const cards = data.rows.map((row: any) => ({
      id: row.id,
      sessionId: row.session_id,
      content: row.content,
      columnId: row.column_id,
      position: row.position,
      createdBy: row.created_by || undefined,
      createdAt: row.created_at
    }));

    res.json({ cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get cards' });
  }

});

export default router;
