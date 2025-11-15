import { useState, useEffect } from "react";
import type { Card } from "../types";
import { createCard, deleteCard, getCardsForSession, updateCard as fetchUpdateCard  } from "../services/card-service";

export default function useCardService(sessionId: string) {
    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function fetchCards() {
      try {
        setLoading(true)
        const data = await getCardsForSession(sessionId)
        setCards(data.cards)
        setError(null)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    async function addCard(newCard: Omit<Card, 'id'>) {
      const createdCard = await createCard(newCard)
      setCards((prevCards) => [...prevCards, createdCard])

      return createdCard
    }

    async function removeCard(id: string) {
      setCards((prevCards) => prevCards.filter((card) => String(card.id) !== id))
      await deleteCard(id)
    }

    async function updateCard(updatedCard: Card) {
      setCards((prevCards) => prevCards.map((card) => (String(card.id) === String(updatedCard.id) ? updatedCard : card)))
      await fetchUpdateCard(updatedCard)
    }

    useEffect(() => {
        fetchCards()
    }, [])


    return {
        cards,
        loading,
        setLoading,
        error,
        fetchCards,
        addCard,
        removeCard,
        updateCard,
    }
}
