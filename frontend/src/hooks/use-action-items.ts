import type { ActionItemFormData, SessionData } from "../types";
import { createActionItem, deleteActionItem, updateActionItem } from "../services/action-item-service";

interface ActionItemsHookProps {
  sessionId: string,
  sessionData: SessionData | null,
  setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>,
  setOperationError: React.Dispatch<React.SetStateAction<string | null>>
}

export default function useActionItems({ sessionId, sessionData, setSessionData, setOperationError }: ActionItemsHookProps) {
  async function addActionItem(data: ActionItemFormData): Promise<void> {
    try {
      const newActionItem = await createActionItem({
        sessionId,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
      })


      setSessionData((prev) => prev ? {
        ...prev,
        actionItems: [...prev.actionItems, newActionItem]
      } : null)
      setOperationError(null)
    } catch (error) {
      const errorMessage = `Failed to add action item: ${(error as Error).message}`;
      setOperationError(errorMessage);
      throw error;
    }
  }

  async function changeActionItemStatus(id: number, newStatus: 'pending' | 'in_progress' | 'completed'): Promise<void> {
    const previousData = sessionData;

    try {
       // optimistic update
      setSessionData((prev) => prev ? {
        ...prev,
        actionItems: prev.actionItems.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      } : null)

      await updateActionItem({ id, status: newStatus })
      setOperationError(null)
    } catch (error) {
      setSessionData(previousData); // rollback!
      const errorMessage = `Failed to update action item: ${(error as Error).message}`;
      setOperationError(errorMessage);
    }
  }

  async function removeActionItem(id: number): Promise<void> {
    const previousData = sessionData;

    try {
      // optimistic update
      setSessionData((prev) => prev ? {
        ...prev,
        actionItems: prev.actionItems.filter((item) => item.id !== id)
      } : null)

      await deleteActionItem(id)
      setOperationError(null)
    } catch (error) {
      setSessionData(previousData); // rollback!
      const errorMessage = `Failed to remove action item: ${(error as Error).message}`;
      setOperationError(errorMessage);
    }
  }

  return {
    addActionItem,
    changeActionItemStatus,
    removeActionItem,
  }
}
