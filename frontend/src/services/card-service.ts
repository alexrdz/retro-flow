import type { Card } from "../types";
import { API_BASE_URL, getErrorMessage } from "./api";

export async function getCardsForSession(sessionId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/cards?sessionId=${sessionId}`);

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to get cards: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createCard(card: Omit<Card, 'id'>) {
  const { sessionId, content, columnType, position } = card

  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, content, columnType, position }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to create card: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function updateCard(id: string, content: string, columnType: string, position: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, columnType, position }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to update card: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCard(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(`Failed to delete card: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
