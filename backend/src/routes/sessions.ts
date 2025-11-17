import express from 'express';
import { CreateSessionRequest } from '../types';
import { Session, Card } from '../types';
import { nanoid } from 'nanoid';
import { turso } from '../database';
import { sanitizeString, validateRequiredString } from '../utils/validation';
const router = express.Router();

// POST /api/sessions
router.post('/', async (req: express.Request, res: express.Response) => {
  // auto-create 2 default columns when a session is created
  // 1. what went well
  // 2. needs improvement

  try {
    const id = nanoid();
    const { name }: CreateSessionRequest | { name: string } = req.body || { name: 'session-' + id };
    const createdBy = req.body.username;

    let sessionName = name || `session-${id}`;
    if (sessionName) {
      const nameError = validateRequiredString(sessionName, 'name', 100);
      if (nameError) {
        return res.status(400).json({ error: nameError.message });
      }
      sessionName = sanitizeString(sessionName, 100);
    }
    const createdAt = new Date().toISOString();

    await turso.execute({
      sql: 'INSERT INTO sessions (id, name, created_by, created_at) VALUES (?, ?, ?, ?)',
      args: [id, sessionName, createdBy, createdAt]
    });

    // default columns
    await turso.execute({
      sql: 'INSERT INTO columns (session_id, name, position, color, created_at) VALUES (?, ?, ?, ?, ?)',
      args: [id, 'What Went Well', 1, '--green-6', createdAt]
    });

    await turso.execute({
      sql: 'INSERT INTO columns (session_id, name, position, color, created_at) VALUES (?, ?, ?, ?, ?)',
      args: [id, 'Needs Improvement', 2, '--red-6', createdAt]
    });

    const session: Session = {
      id,
      name: sessionName,
      createdBy,
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
      sql: 'SELECT id, name, created_by, created_at FROM sessions WHERE id = ?',
      args: [sessionID]
    });

    const sessionRow = sessionResult.rows[0];
    if (!sessionRow) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session: Session = {
      id: String(sessionRow.id),
      name: String(sessionRow.name),
      createdBy: String(sessionRow.created_by),
      createdAt: String(sessionRow.created_at),
    };

    // fetch columns for session
    const columnsResult = await turso.execute({
      sql: 'SELECT id, session_id, name, position, color, created_at FROM columns WHERE session_id = ?',
      args: [sessionID]
    });

    const columns = columnsResult.rows.map((r: any) => ({
      id: Number(r.id),
      sessionId: String(r.session_id),
      name: String(r.name),
      position: Number(r.position),
      color: String(r.color),
      createdAt: String(r.created_at)
    }));

    // fetch cards for session
    const cardsResult = await turso.execute({
      sql: 'SELECT id, session_id, content, column_id, position, created_by, created_at FROM cards WHERE session_id = ?',
      args: [sessionID]
    });

    const cards: Card[] = cardsResult.rows.map((r: any) => ({
      id: Number(r.id),
      sessionId: String(r.session_id),
      content: String(r.content),
      columnId: Number(r.column_id),
      position: Number(r.position),
      createdBy: String(r.created_by),
      createdAt: String(r.created_at)
    }));

    // fetch action items for session
    const actionItemsResult = await turso.execute({
      sql: 'SELECT id, session_id, title, description, assigned_to, status, created_at FROM action_items WHERE session_id = ?',
      args: [sessionID]
    });

    const actionItems = actionItemsResult.rows.map((r: any) => ({
      id: Number(r.id),
      sessionId: String(r.session_id),
      title: String(r.title),
      description: String(r.description),
      assignedTo: String(r.assigned_to),
      status: String(r.status) as 'pending' | 'in_progress' | 'completed',
      createdAt: String(r.created_at)
    }));

    const sessionData = {
      session,
      columns,
      cards,
      actionItems,
    };

    res.status(200).json(sessionData);

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

    res.json({ message: `Deleted session ${sessionID}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

router.post('/join/:id', async (req: express.Request, res: express.Response) => {
  try {
    const sessionID = req.body.id;
    const username = req.body.username; // username is optional
    console.log(sessionID, username);

    const participantsResult = await turso.execute("SELECT participants FROM sessions WHERE id = ?", [sessionID]);
    if (!participantsResult.rows.length) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const participants = JSON.parse(participantsResult.rows[0].participants as string) || [];
    if (participants.includes(username)) {
      return res.status(400).json({ error: 'User already in session' });
    }

    if (username) {
      participants.push(username);
    }

    await turso.execute("UPDATE sessions SET participants = ? WHERE id = ?", [JSON.stringify(participants), sessionID]);
    res.json({ message: `Joined session ${sessionID}`, sessionId: sessionID });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join session', message: (error as Error).message });
  }
});

export default router;
