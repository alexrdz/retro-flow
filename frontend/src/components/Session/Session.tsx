  import { useState, useEffect, useMemo } from 'react'
  import { useLocation } from 'react-router-dom'
  import type { Card, Column as ColumnType, SessionData } from '../../types'
  import CardComponent from '../Card/Card'
  import Column from '../Column/Column'
  import CopyButton from '../CopyButton/CopyButton'
  import { getSession } from '../../services/session-service'
  import { createCard, updateCard as updateCardService, deleteCard } from '../../services/card-service'

export default function Session() {
  const sessionId = useLocation().pathname.split('/').pop() ?? ''
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  async function addCard(newCard: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    const createdCard = await createCard(newCard);

    // optimistic update
    setSessionData((prev) => prev ? {
      ...prev,
      cards: [...prev.cards, createdCard]
    } : null);

    return createdCard;
  }

  async function removeCard(id: string) {
    // optimistic update
    setSessionData(prev => prev ? {
      ...prev,
      cards: prev.cards.filter(card => String(card.id) !== id)
    } : null);

    await deleteCard(id);
  }

  async function updateCard(updatedCard: Card) {
    // optimistic update
    setSessionData(prev => prev ? {
      ...prev,
      cards: prev.cards.map(card => String(card.id) === String(updatedCard.id) ? updatedCard : card)
    } : null);

    await updateCardService(updatedCard);
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
        <h1>hello, alex</h1>
        <p>Welcome to Retro Session ID: {sessionId}</p>
        <p data-cluster="gap:sm align:center">
          Share this link with your team:
          <input style={{ flexGrow: 1  }} type="text" value={`http://localhost:5173/session/${sessionId}`} readOnly />
          <CopyButton text={`http://localhost:5173/session/${sessionId}`} />
        </p>
      </header>

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

        {/* TODO: Add ActionItems component here */}
        {sessionData.actionItems.length > 0 && (
          <div>
            <h2>Action Items
  ({sessionData.actionItems.length})</h2>
            {/* We'll build this component next */}
          </div>
        )}
    </div>
  )
}
