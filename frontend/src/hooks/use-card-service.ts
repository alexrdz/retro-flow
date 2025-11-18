import { useState, useEffect } from "react";
import type { Card, SessionData } from "../types";
import { createCard, getCardsForSession, updateCard as fetchUpdateCard  } from "../services/card-service";
import { socketService } from "../services/socket-service";
import { getUsername } from "../utils/user";
import React from "react";

interface CardServiceProps {
  sessionId: string,
  sessionData: SessionData | null,
  setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>,
  setOperationError: React.Dispatch<React.SetStateAction<string | null>>,
  deleteCard: (id: string, username: string) => Promise<void>,
  updateCardService: (updatedCard: Card) => Promise<void>,
  createCard: (newCard: Omit<Card, 'id' | 'createdAt'>) => Promise<Card>,
}

export default function useCardService({
  sessionId,
  sessionData,
  setSessionData,
  setOperationError,
  deleteCard,
  updateCardService,
  createCard,
}: CardServiceProps) {
    const [loading, setLoading] = useState(true)

    async function addCard(newCard: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    try {
      const createdCard = await createCard(newCard);
      // update local state
      setSessionData((prev) => prev ? {
        ...prev,
        cards: [...prev.cards, createdCard]
      } : null);

      // broadcast to other users
      socketService.emitCardCreated(sessionId, createdCard);

      setOperationError(null);
      return createdCard;
    } catch (error) {
      const errorMessage = `Failed to add card: ${(error as Error).message}`;
      setOperationError(errorMessage);
      throw error;
    }
  }

  async function removeCard(id: string) {
    const previousData = sessionData; // backup data for optimistic update
    const username = getUsername();
    if (!username) {
      throw new Error('Username not found');
    }

    try {
      // optimistic update
      setSessionData(prev => prev ? {
        ...prev,
        cards: prev.cards.filter((card: Card) => String(card.id) !== id)
      } : null);
      await deleteCard(id, username);

      // broadcast to other users
      socketService.emitCardDeleted(sessionId, Number(id));

      setOperationError(null);
    } catch (error) {
      setSessionData(previousData); // rollback!
      const errorMessage = `Failed to remove card: ${(error as Error).message}`;
      setOperationError(errorMessage);
    }
  }

  async function updateCard(updatedCard: Card) {
    const previousData = sessionData; // backup data for optimistic update

    try {
      // optimistic update
      setSessionData(prev => prev ? {
        ...prev,
        cards: prev.cards.map((card: Card) => String(card.id) === String(updatedCard.id) ? updatedCard : card)
      } : null);

      // broadcast to other users
      socketService.emitCardUpdated(sessionId, updatedCard);

      await updateCardService(updatedCard);
      setOperationError(null);
    } catch (error) {
      setSessionData(previousData); // rollback!
      setOperationError(`Failed to update card: ${(error as Error).message}`);
    }
  }

    return {
        loading,
        setLoading,
        addCard,
        removeCard,
        updateCard,
    }
}
