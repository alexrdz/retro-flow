import express from 'express';
const router = express.Router();
import { turso } from '../database';
import { ActionItem, CreateActionItemRequest, UpdateActionItemRequest } from '../types';
import { sanitizeString, validateEnum, validateOptionalString, validateRequiredString, ValidationError } from '../utils/validation';

// POST /api/action-items
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
      const { sessionId, title, description, assignedTo }: CreateActionItemRequest = req.body;

      const errors: ValidationError[] = [];

      const sessionIdError = validateRequiredString(sessionId, 'sessionId', 100);
      if (sessionIdError) errors.push(sessionIdError);

      const titleError = validateRequiredString(title, 'title', 200);
      if (titleError) errors.push(titleError);

      const descriptionError = validateOptionalString(description, 'description', 500);
      if (descriptionError) errors.push(descriptionError);

      const assignedToError = validateOptionalString(assignedTo, 'assignedTo', 100);
      if (assignedToError) errors.push(assignedToError);

      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        });
      }

      const sanitizedTitle = sanitizeString(title, 200);
      const sanitizedDescription = description ? sanitizeString(description, 500) : null;
      const sanitizedAssignedTo = assignedTo ? sanitizeString(assignedTo, 100) : null;

      // Validate required fields
      if (!sessionId || !sanitizedTitle) {
        return res.status(400).json({ error: 'sessionId and title are required' });
      }

      const timestamp = new Date().toISOString();
      const result = await turso.execute(
        'INSERT INTO action_items (session_id, title, description, assigned_to, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [sessionId, sanitizedTitle, sanitizedDescription, sanitizedAssignedTo, 'pending', timestamp]
      );

      const newActionItemId = Number(result.lastInsertRowid);
      const newActionItem: ActionItem = {
        id: newActionItemId,
        sessionId,
        title: sanitizedTitle,
        description: sanitizedDescription || undefined,
        assignedTo: sanitizedAssignedTo || undefined,
        status: 'pending',
        createdAt: timestamp
      };

      res.status(201).json(newActionItem);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create action item' });
    }
  });

// PUT /api/action-items/:id
router.put('/:id', async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { title, description, assignedTo, status }: UpdateActionItemRequest = req.body;

      const errors: ValidationError[] = [];

      if (title !== undefined) {
        const titleError = validateRequiredString(title, 'title', 200);
        if (titleError) errors.push(titleError);
      }

      if (description !== undefined) {
        const descError = validateOptionalString(description, 'description', 500);
        if (descError) errors.push(descError);
      }

      if (assignedTo !== undefined) {
        const assignedError = validateOptionalString(assignedTo, 'assignedTo', 100);
        if (assignedError) errors.push(assignedError);
      }

      if (status !== undefined) {
        const statusError = validateEnum(status, 'status', ['pending', 'in_progress', 'completed']);
        if (statusError) errors.push(statusError);
      }

      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        });
      }

      const setClauses: string[] = [];
      const args: (string | null)[] = [];

      if (title !== undefined) {
        setClauses.push('title = ?');
        args.push(title);
      }
      if (description !== undefined) {
        setClauses.push('description = ?');
        args.push(description || null);
      }
      if (assignedTo !== undefined) {
        setClauses.push('assigned_to = ?');
        args.push(assignedTo || null);
      }
      if (status !== undefined) {
        setClauses.push('status = ?');
        args.push(status);
      }

      if (setClauses.length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
      }

      args.push(id);

      const result = await turso.execute(
        `UPDATE action_items SET ${setClauses.join(',')} WHERE id = ?`,
        args
      );

      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: 'Action item not found' });
      }

      res.json({ message: `Updated action item ${id}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update action item' });
    }
  });

// DELETE /api/action-items/:id
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const result = await turso.execute("DELETE FROM action_items WHERE id = ?", [id]);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Action item not found' });
    }

    res.json({ message: `Deleted action item ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete action item' });
  }
});

  // GET /api/action-items (optional - mainly for debugging)
router.get('/', async (req: express.Request, res: express.Response) => {
    try {
      const sessionId = req.query.sessionId;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const data = await turso.execute(
        "SELECT * FROM action_items WHERE session_id = ?",
        [String(sessionId)]
      );

      const actionItems = data.rows.map((row: any) => ({
        id: row.id,
        sessionId: row.session_id,
        title: row.title,
        description: row.description || undefined,
        assignedTo: row.assigned_to || undefined,
        status: row.status,
        createdAt: row.created_at
      }));

      res.json({ actionItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get action items' });
    }
  });

  export default router;
