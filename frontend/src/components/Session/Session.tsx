import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { SessionData } from '../../types'
import CardComponent from '../Card/Card'
import Column from '../Column/Column'
import CopyButton from '../CopyButton/CopyButton'
import { createCard, updateCard as updateCardService, deleteCard } from '../../services/card-service'

import ActionItems from '../ActionItems/ActionItems'
import ErrorBanner from '../ErrorBanner/ErrorBanner'

import useSessionSocket from '../../hooks/use-session-socket'
import useCardService from '../../hooks/use-card-service'
import useActionItems from '../../hooks/use-action-items'
import useSessionData from '../../hooks/use-session-data'
import usePresence from '../../hooks/use-presence'
import OnlineUsers from '../OnlineUsers/OnlineUsers'

export default function Session() {
  const sessionId = useLocation().pathname.split('/').pop() ?? ''
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  useSessionSocket(sessionId, setSessionData)
  const {
    addCard,
    removeCard,
    updateCard
  } = useCardService({sessionId, sessionData, setSessionData, setOperationError, deleteCard, updateCardService, createCard})

  const {
    addActionItem,
    changeActionItemStatus,
    removeActionItem,
  } = useActionItems({sessionId, sessionData, setSessionData, setOperationError})

  useSessionData({sessionId, setSessionData, setError, setLoading, setUsername})
  const { onlineUsers, readyUsers, isReady, toggleReady } = usePresence(sessionId)



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

        <div data-cluster="gap:sm align:center">
          <p>Share this session's ID with your team:</p>
          <input style={{ flexGrow: 1  }} type="text" value={sessionId} readOnly />
          <CopyButton text={sessionId} />
        </div>
      </header>

      <OnlineUsers
        onlineUsers={onlineUsers}
        readyUsers={readyUsers}
        currentUser={username ?? 'anonymous'}
        onToggleReady={toggleReady}
        isReady={isReady}
      />

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
                  {columnCards.filter(card => card.createdBy === username).map((card) => (
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
        showForm={username === sessionData.session.createdBy}
        />

    </div>
  )
}
