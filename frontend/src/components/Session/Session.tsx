import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Card, SessionData } from '../../types'
import CardComponent from '../Card/Card'
import Column from '../Column/Column'
import CopyButton from '../CopyButton/CopyButton'
import { getSession } from '../../services/session-service'
import { createCard, updateCard as updateCardService, deleteCard } from '../../services/card-service'

import ActionItems from '../ActionItems/ActionItems'
import { createActionItem, updateActionItem, deleteActionItem } from '../../services/action-item-service'
import type { ActionItemFormData } from '../../types'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import { getUsername } from '../../utils/user'

export default function Session() {
  const sessionId = useLocation().pathname.split('/').pop() ?? ''
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        setLoading(true)
        const data = await getSession(sessionId)
        setSessionData(data)
        setError(null)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId])

  useEffect(() => {
    const username = getUsername();
    if (username) {
      setUsername(username);
    }
  }, [])

  async function addCard(newCard: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    try {
      const createdCard = await createCard(newCard);
      // optimistic update
      setSessionData((prev) => prev ? {
        ...prev,
        cards: [...prev.cards, createdCard]
      } : null);
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
    try {
      // optimistic update
      setSessionData(prev => prev ? {
        ...prev,
        cards: prev.cards.filter(card => String(card.id) !== id)
      } : null);
      await deleteCard(id);
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
        cards: prev.cards.map(card => String(card.id) === String(updatedCard.id) ? updatedCard : card)
      } : null);

      await updateCardService(updatedCard);
      setOperationError(null);
    } catch (error) {
      setSessionData(previousData); // rollback!
      setOperationError(`Failed to update card: ${(error as Error).message}`);
    }
  }

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

  function getCardsForColumn(columnId: number) {
    return sessionData?.cards.filter(card => String(card.columnId) === String(columnId)) ?? [];
  }

  if (loading) {
    return <div className='app-container'><p>Loading...</p></div>
  }

  if (error) {
    return <div className='app-container'><p>Error: {error}</p></div>
  }

  if (!sessionData) {
    return <div className='app-container'><p>Session not found</p></div>
  }




  return (
    <div className='app-container' data-container data-stack="gap:md">
      <header>
        <h1>hello, {username || 'user'}</h1>
        <p>Welcome to Retro Session ID: {sessionId}</p>
        <div data-cluster="gap:sm align:center">
          <p>Share this link with your team:</p>
          <input style={{ flexGrow: 1  }} type="text" value={`http://localhost:5173/session/${sessionId}`} readOnly />
          <CopyButton text={`http://localhost:5173/session/${sessionId}`} />
        </div>
      </header>

      {operationError && <ErrorBanner operationError={operationError} setOperationError={setOperationError} />}

      <div data-switcher="gap:sm collapse:sm">
        {sessionData.columns
            .sort((a, b) => a.position - b.position)
            .map((column) => {
              const columnCards = getCardsForColumn(column.id)

              return (
                <Column
                  key={column.id}
                  column={column}
                  onCardAdded={addCard}
                  sessionId={sessionId}
                >
                  {columnCards.map((card) => (
                    <CardComponent
                      key={card.id}
                      card={card}
                      removeCard={removeCard}
                      updateCard={updateCard}
                    />
                  ))}
                </Column>
              )
            })}
      </div>

      <ActionItems
        actionItems={sessionData.actionItems}
        onAdd={addActionItem}
        onStatusChange={changeActionItemStatus}
        onDelete={removeActionItem}
        />

    </div>
  )
}
