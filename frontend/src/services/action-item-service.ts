import type { ActionItem } from "../types";
import { API_BASE_URL, getErrorMessage } from "./api";

export async function getActionItemsForSession(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/action-items?sessionId=${sessionId}`);

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to get action items: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createActionItem(actionItem: Omit<ActionItem, 'id' | 'createdAt' | 'status'>) {
  const { sessionId, title, description, assignedTo } = actionItem;

  try {
    const response = await fetch(`${API_BASE_URL}/action-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, title, description, assignedTo }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to create action item: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateActionItem(actionItem: Partial<ActionItem> & { id: number }) {
  const { id, title, description, assignedTo, status } = actionItem;

  try {
    const response = await fetch(`${API_BASE_URL}/action-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, assignedTo, status }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to update action item: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteActionItem(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/action-items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to delete action item: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
