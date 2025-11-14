import express from 'express';
import { CreateSessionRequest } from '../types';
import { Session, Card } from '../types';
import { nanoid } from 'nanoid';
import { turso } from '../database';
const router = express.Router();

// POST /api/sessions
router.post('/', async (req: express.Request, res: express.Response) => {
  // curl -X POST http://localhost:3001/api/sessions -H 'Content-Type: application/json' -d '{"name": "test"}'

  try {
    const { name }: CreateSessionRequest = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const id = nanoid();
    const createdAt = new Date().toISOString();

    await turso.execute({
      sql: 'INSERT INTO sessions (id, name, created_at) VALUES (?, ?, ?)',
      args: [id, name, createdAt]
    });

    const session: Session = {
      id,
      name,
      createdAt
    };

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// GET /api/session/:id
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const sessionID = req.params.id;
    const sessionResult = await turso.execute({
      sql: 'SELECT id, name, created_at FROM sessions WHERE id = ?',
      args: [sessionID]
    });

    const sessionRow = sessionResult.rows[0];
    if (!sessionRow) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session: Session = {
      id: String(sessionRow.id),
      name: String(sessionRow.name),
      createdAt: String(sessionRow.created_at)
    };

    const cardsResult = await turso.execute({
      sql: 'SELECT id, session_id, content, column_type, position, created_at FROM cards WHERE session_id = ?',
      args: [sessionID]
    });

    const cards: Card[] = cardsResult.rows.map((r: any) => ({
      id: Number(r.id),
      sessionId: String(r.session_id),
      content: String(r.content),
      columnType: String(r.column_type) as Card['columnType'],
      position: Number(r.position),
      createdAt: String(r.created_at)
    }));

    const sessionWithCards = {
      ...session,
      cards
    };

    res.status(200).json(sessionWithCards);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// GET /api/sessions
router.get('/', async (req: express.Request, res: express.Response) => {
  const sessions = await turso.execute("SELECT * FROM sessions");
  const sessionsArray = sessions.rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    createdAt: String(r.created_at)
  }));

  res.json({ message: `Get sessions`, sessions: sessionsArray });
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const sessionID = req.params.id;
    const result = await turso.execute("DELETE FROM sessions WHERE id = ?", [sessionID]);
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    console.log(result);
    res.json({ message: `Deleted session ${sessionID}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
