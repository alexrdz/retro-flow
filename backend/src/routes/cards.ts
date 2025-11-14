import express from 'express';
const router = express.Router();
import { turso } from '../database';
import { Card, CreateCardRequest, UpdateCardRequest } from '../types';

// POST /api/cards
router.post('/', async (req: express.Request, res: express.Response) => {
  // curl -X POST http://localhost:3001/api/cards -H 'Content-Type: application/json' -d '{"content": "test"}'
    try {
    const { sessionId, content, columnType, position }: CreateCardRequest = req.body;

    const timestamp = new Date().toISOString();
    const result = await turso.execute(
      'INSERT INTO cards (session_id, content, column_type, position, created_at) VALUES (?, ?, ?, ?, ?)',
      [sessionId, content, columnType, position, timestamp]
    );

    console.log(result);

    const newCardId = Number(result.lastInsertRowid);
    const newCard: Card = {
      id: newCardId,
      sessionId,
      content,
      columnType,
      position,
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
    const { id } = req.params;
    const { content, columnType, position }: UpdateCardRequest = req.body;

    const setClauses: string[] = [];
    const args: (string | number)[] = [];

    if (content !== undefined) {
      setClauses.push('content = ?');
      args.push(content);
    }
    if (columnType !== undefined) {
      setClauses.push('column_type = ?');
      args.push(columnType);
    }
    if (position !== undefined) {
      setClauses.push('position = ?');
      args.push(position);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    args.push(id);

    const result = await turso.execute(
      `UPDATE cards SET ${setClauses.join(', ')} WHERE id = ?`,
      args
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    console.log(result);

    res.json({ message: `Updated card ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// DELETE /api/cards/:id
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const result = await turso.execute("DELETE FROM cards WHERE id = ?", [id]);
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    console.log(result);
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

    if (data.rows.length === 0) {
      return res.status(404).json({ error: 'No cards found for session' });
    }

    const cards = data.rows.map((row: any) => ({
    id: row.id,
    sessionId: row.session_id,
    content: row.content,
    columnType: row.column_type,
    position: row.position,
    createdAt: row.created_at
  }));
  res.json({ message: `Get cards!`, cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get cards' });
  }

});

export default router;
